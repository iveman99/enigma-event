import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { parsePassCode, passCode } from "@/lib/festival-pass";

let db: PGlite;
const leader = "00000000-0000-4000-8000-000000000011";
const organiser = "00000000-0000-4000-8000-000000000012";
const receipt = `${leader}/receipt/00000000-0000-4000-8000-000000000014.jpg`;
const participant = { name: "Ravi More", email: "ravi@example.com", phone: "+919876543210", college: "Test College", course: "BSc CS" };
const members = [
  { name: "Asha Patil", email: "asha@example.com", phone: "+919876543211", college: "Test College" },
  { name: "Isha Shah", email: "isha@example.com", phone: "+919876543212", college: "Test College" },
];
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
  await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,'ravi@example.com',now()),($2,'organiser@example.com',now())", [leader, organiser]);
  await db.query("insert into public.organisers(user_id) values($1)", [organiser]);
  await db.exec(readFileSync(new URL("../supabase/migrations/202610300002_festival_checkin.sql", import.meta.url), "utf8"));
});
afterAll(async () => { await db?.close(); });
beforeEach(async () => { await db.exec("delete from public.registration_audit; delete from public.event_registrations; delete from public.festival_passes;"); });
async function approved() {
  const result = await db.query<{id:string}>(`insert into public.event_registrations(user_id,event_id,event_title,team_name,members,participant,id_card_path,receipt_path,transaction_reference,amount,status,ticket_code)
    values($1,'decode-hunt','Decode The Hunt','Code Crew',$2::jsonb,$3::jsonb,'id.jpg',$4,'UTR123456',149,'approved','ENG27-TEST') returning id`,
    [leader, JSON.stringify(members), JSON.stringify(participant), receipt]);
  return result.rows[0].id;
}
describe("individual festival passes and attendance", () => {
  it("completes profile, submission, correction, approval, individual passes and attendance in sequence", async () => {
    const submit = () => db.query<{id:string;version:number;status:string}>("select * from public.submit_event_registration($1,'decode-hunt','Code Crew',$2::jsonb,$3,'WORKFLOW123')", [leader,JSON.stringify(members),receipt]);
    await expect(submit()).rejects.toThrow(/PROFILE_INCOMPLETE/);
    await db.query("update public.profiles set first_name='Ravi',last_name='More',phone='+919876543210',college='Test College',course='BSc CS',id_card_path='id.jpg' where id=$1",[leader]);
    await db.exec("update public.payment_settings set enabled=true,payee='Enigma',upi_id='enigma@bank',qr_path='qr.jpg'");
    const initial = (await submit()).rows[0];
    expect(initial.status).toBe("pending");
    expect((await db.query("select * from public.festival_passes")).rows).toHaveLength(0);
    await db.query("select public.review_event_registration($1,$2,$3,'rejected','Upload a readable receipt')",[organiser,initial.id,initial.version]);
    const corrected = (await submit()).rows[0];
    expect(corrected.version).toBeGreaterThan(initial.version);
    await db.query("select public.review_event_registration($1,$2,$3,'approved','Payment and ID verified')",[organiser,corrected.id,corrected.version]);
    const passes = (await db.query<{token:string}>("select token from public.festival_passes")).rows;
    expect(passes).toHaveLength(3);
    await db.query("select public.check_in_festival_pass($1,$2)",[organiser,passes[0].token]);
    expect((await db.query("select * from public.festival_passes where checked_in_at is not null")).rows).toHaveLength(1);
    const status = (await db.query<{status:string;ticket_code:string}>("select status,ticket_code from public.event_registrations where id=$1",[initial.id])).rows[0];
    expect(status.status).toBe("approved"); expect(status.ticket_code).toMatch(/^ENG27-/);
    await db.query("update public.profiles set college='' where id=$1",[leader]);
  });
  it("creates one distinct pass for the leader and each teammate after approval", async () => {
    await approved();
    const { rows } = await db.query<{email:string;token:string}>("select email,token from public.festival_passes order by email");
    expect(rows.map(r => r.email)).toEqual(["asha@example.com","isha@example.com","ravi@example.com"]);
    expect(new Set(rows.map(r => r.token)).size).toBe(3);
    expect(parsePassCode(passCode(rows[0].token))).toBe(rows[0].token);
  });
  it("checks in once, reports repeat scans and allows a logged correction", async () => {
    await approved();
    const { rows } = await db.query<{token:string}>("select token from public.festival_passes where email='asha@example.com'");
    const token = rows[0].token;
    const first = await db.query<{result:{result:string}}>("select public.check_in_festival_pass($1,$2) as result",[organiser,token]);
    expect(first.rows[0].result.result).toBe("checked_in");
    const second = await db.query<{result:{result:string}}>("select public.check_in_festival_pass($1,$2) as result",[organiser,token]);
    expect(second.rows[0].result.result).toBe("already_checked_in");
    await expect(db.query("select public.reverse_festival_check_in($1,$2,'no')",[organiser,token])).rejects.toThrow(/REASON_REQUIRED/);
    await db.query("select public.reverse_festival_check_in($1,$2,'Scanned wrong person')",[organiser,token]);
    const status = await db.query<{checked_in_at:string|null}>("select checked_in_at from public.festival_passes where token=$1",[token]);
    expect(status.rows[0].checked_in_at).toBeNull();
  });
  it("rejects a pass after its only approved event is cancelled", async () => {
    const id = await approved();
    const { rows } = await db.query<{token:string}>("select token from public.festival_passes where email='asha@example.com'");
    await db.query("update public.event_registrations set status='archived',ticket_code=null where id=$1",[id]);
    await expect(db.query("select public.check_in_festival_pass($1,$2)",[organiser,rows[0].token])).rejects.toThrow(/NO_ACTIVE_EVENTS/);
  });
  it("blocks a student from the check-in function", async () => {
    await approved();
    const { rows } = await db.query<{token:string}>("select token from public.festival_passes limit 1");
    await expect(db.query("select public.check_in_festival_pass($1,$2)",[leader,rows[0].token])).rejects.toThrow(/NOT_ORGANISER/);
  });
});
