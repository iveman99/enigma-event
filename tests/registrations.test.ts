import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { entryFee, ownsUpload, registrationSchema } from "@/lib/registration";
let db: PGlite;
const student = "00000000-0000-4000-8000-000000000011", organiser = "00000000-0000-4000-8000-000000000012", outsider = "00000000-0000-4000-8000-000000000013";
const receipt = `${student}/receipt/00000000-0000-4000-8000-000000000014.jpg`;
const member = { name: "Asha Patil", email: "asha@example.com", phone: "+919876543211", college: "Test College" };
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,raw_user_meta_data jsonb not null default '{}');
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth to anon,authenticated,service_role;`);
  await db.exec(readFileSync(new URL("../supabase/migrations/202610290001_signup.sql", import.meta.url), "utf8"));
  await db.exec(readFileSync(new URL("../supabase/migrations/202610300001_registrations.sql", import.meta.url), "utf8"));
  for (const [id, email] of [[student,"student@example.com"],[organiser,"organiser@example.com"],[outsider,"other@example.com"]]) {
    await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())", [id,email]);
  }
  await db.query("update public.profiles set first_name='Ravi',last_name='More',phone='+919876543210',college='Test College',course='BSc CS',id_card_path=$1 where id=$2", [`${student}/id/test.jpg`,student]);
  await db.query("insert into public.organisers(user_id) values($1)", [organiser]);
  await db.exec("update public.payment_settings set payee='Enigma',upi_id='enigma@bank',qr_path='test/qr.jpg',enabled=true");
});
afterAll(async () => { await db?.close(); });
beforeEach(async () => { await db.exec("reset role; delete from public.registration_audit; delete from public.event_registrations; update public.payment_settings set enabled=true;"); });
const submit = (event="blind-dates",members: unknown[]=[],reference="UTR123456",path=receipt,actor=student) => db.query<{id:string;amount:number;status:string;version:number;ticket_code:string|null}>("select * from public.submit_event_registration($1,$2,'Test Team',$3::jsonb,$4,$5)",[actor,event,JSON.stringify(members),path,reference]);
const review = (id:string,version=1,decision="approved",actor=organiser,note="") => db.query<{status:string;ticket_code:string;version:number}>("select * from public.review_event_registration($1,$2,$3,$4,$5)",[actor,id,version,decision,note]);
describe("registration security and payment decisions", () => {
  it("calculates solo/team fees and validates the four event team rules", () => {
    expect(entryFee(1)).toBe(99); expect(entryFee(3)).toBe(149);
    const base = {eventId:"blind-dates",teamName:"",members:[],receiptPath:receipt,transactionReference:"UTR123456",profileConfirmed:true};
    expect(registrationSchema.safeParse(base).success).toBe(true);
    expect(registrationSchema.safeParse({...base,eventId:"decode-hunt"}).success).toBe(false);
    expect(registrationSchema.safeParse({...base,members:[member]}).success).toBe(false);
    expect(registrationSchema.safeParse({...base,eventId:"decode-hunt",teamName:"Code Crew",members:[member]}).success).toBe(true);
    expect(registrationSchema.safeParse({...base,amount:1,status:"approved"}).success).toBe(false);
    expect(ownsUpload(receipt,student,"receipt")).toBe(true);
    expect(ownsUpload(receipt,outsider,"receipt")).toBe(false);
  });
  it("stores a pending entry and a server-sourced participant snapshot; no pass issued", async () => {
    const {rows} = await submit();
    expect(rows[0]).toMatchObject({amount:99,status:"pending",ticket_code:null});
    const result=await db.query<{participant:{email:string}}>("select participant from public.event_registrations");
    expect(result.rows[0].participant.email).toBe("student@example.com");
  });
  it("enforces team size and charges 149 for the entire team", async () => {
    await expect(submit("decode-hunt")).rejects.toThrow(/INVALID_TEAM/);
    const {rows}=await submit("decode-hunt",[member]); expect(rows[0].amount).toBe(149);
  });
  it("blocks incomplete profiles, closed registration and foreign receipts", async () => {
    await expect(submit("blind-dates",[],"UTR123456",receipt,outsider)).rejects.toThrow(/PROFILE_INCOMPLETE/);
    await expect(submit("blind-dates",[],"UTR123456",`${outsider}/receipt/test.jpg`)).rejects.toThrow(/INVALID_RECEIPT/);
    await db.exec("update public.payment_settings set enabled=false");
    await expect(submit()).rejects.toThrow(/REGISTRATIONS_CLOSED/);
  });
  it("blocks duplicate event submissions and reused transaction references", async () => {
    await submit(); await expect(submit()).rejects.toThrow(/ALREADY_REGISTERED/);
    await expect(submit("fifa-addicts",[],"UTR123456",receipt.replace('014.jpg','015.jpg'))).rejects.toThrow(/unique/i);
  });
  it("denies students direct records, role grants, status changes and RPC execution", async () => {
    await db.exec("set role authenticated");
    for (const table of ["event_registrations","organisers","payment_settings","registration_audit"]) await expect(db.query(`select * from public.${table}`)).rejects.toThrow(/permission denied/i);
    await expect(db.query("insert into public.organisers(user_id) values($1)",[student])).rejects.toThrow(/permission denied/i);
    await expect(submit()).rejects.toThrow(/permission denied/i);
    await expect(db.query("update public.profiles set id_card_path='forged' where id=$1",[student])).rejects.toThrow(/permission denied/i);
  });
  it("only an organiser can approve and a second decision conflicts", async () => {
    const row=(await submit()).rows[0];
    await expect(review(row.id,1,"approved",outsider)).rejects.toThrow(/NOT_ORGANISER/);
    const approved=(await review(row.id)).rows[0]; expect(approved.status).toBe("approved"); expect(approved.ticket_code).toMatch(/^ENG27-/);
    await expect(review(row.id)).rejects.toThrow(/REVIEW_CONFLICT/);
  });
  it("requires correction reason and allows resubmission with a new review version", async () => {
    const row=(await submit()).rows[0]; await expect(review(row.id,1,"rejected")).rejects.toThrow(/INVALID_REVIEW/);
    await review(row.id,1,"rejected",organiser,"Receipt is unreadable");
    const next=(await submit()).rows[0]; expect(next.status).toBe("pending"); expect(next.version).toBe(3);
    await expect(review(row.id,1)).rejects.toThrow(/REVIEW_CONFLICT/);
    const {rows}=await db.query("select action from public.registration_audit order by id"); expect(rows).toEqual([{action:"submitted"},{action:"rejected"},{action:"resubmitted"}]);
  });
  it("prevents self-approval even if the student is also an organiser", async () => {
    const row=(await submit()).rows[0]; await db.query("insert into public.organisers(user_id) values($1) on conflict do nothing",[student]);
    await expect(review(row.id,1,"approved",student)).rejects.toThrow(/SELF_REVIEW/);
    await db.query("delete from public.organisers where user_id=$1",[student]);
  });
  it("records organiser cancellation, invalidates the pass and rejects stale changes", async () => {
    const row=(await submit()).rows[0]; await review(row.id);
    await expect(db.query("select * from public.manage_event_registration($1,$2,2,'archive','','Cancelled on request')",[outsider,row.id])).rejects.toThrow(/NOT_ORGANISER/);
    const result=await db.query<{status:string;ticket_code:string|null}>("select * from public.manage_event_registration($1,$2,2,'archive','','Cancelled on request')",[organiser,row.id]);
    expect(result.rows[0]).toMatchObject({status:"archived",ticket_code:null});
    await expect(db.query("select * from public.manage_event_registration($1,$2,2,'archive','','Cancelled on request')",[organiser,row.id])).rejects.toThrow(/REVIEW_CONFLICT/);
    const audit=await db.query<{action:string}>("select action from public.registration_audit order by id");
    expect(audit.rows.map(r=>r.action)).toEqual(["submitted","approved","archive"]);
  });
});
