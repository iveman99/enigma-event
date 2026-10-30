import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const first = "00000000-0000-4000-8000-000000000001";
const second = "00000000-0000-4000-8000-000000000002";
let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  // Emulate Supabase roles and auth.uid with real PostgreSQL row security.
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key, raw_user_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated;
  `);
  await db.exec(readFileSync(new URL("../supabase/migrations/202610290001_signup.sql", import.meta.url), "utf8"));
  await db.query("insert into auth.users (id, raw_user_meta_data) values ($1, $2), ($3, $4)", [
    first, JSON.stringify({ first_name: "Asha", last_name: "Patil", phone: "+919876543210", role: "admin" }),
    second, JSON.stringify({ full_name: "Ravi More" }),
  ]);
});
afterAll(async () => { await db?.close(); });
beforeEach(async () => { await db.exec("reset role;"); });

async function asStudent(id: string) {
  await db.exec("set role authenticated;");
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
}

describe("signup database migration", () => {
  it("creates profiles for OTP and OAuth accounts without granting roles", async () => {
    const { rows } = await db.query<{ id: string; first_name: string; last_name: string }>("select * from public.profiles order by id");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ first_name: "Asha", last_name: "Patil" });
    expect(rows[1]).toMatchObject({ first_name: "Ravi", last_name: "More" });
    expect(rows[0]).not.toHaveProperty("role");
  });
  it("denies anonymous profile access", async () => {
    await db.exec("set role anon;");
    await expect(db.query("select * from public.profiles")).rejects.toThrow(/permission denied/i);
  });
  it("students can read only their own row", async () => {
    await asStudent(first);
    const { rows } = await db.query<{ id: string }>("select id from public.profiles");
    expect(rows).toEqual([{ id: first }]);
  });
  it("students cannot update another student's profile", async () => {
    await asStudent(first);
    const { rows } = await db.query("update public.profiles set first_name='Impersonated' where id=$1 returning id", [second]);
    expect(rows).toEqual([]);
  });
  it("allows own profile edits but not ownership or timestamp changes", async () => {
    await asStudent(first);
    const result = await db.query("update public.profiles set college='UDCS' where id=$1 returning college", [first]);
    expect(result.rows).toEqual([{ college: "UDCS" }]);
    await expect(db.query("update public.profiles set id=$1 where id=$2", [second, first])).rejects.toThrow(/permission denied/i);
    await expect(db.query("update public.profiles set created_at=now() where id=$1", [first])).rejects.toThrow(/permission denied/i);
  });
  it("does not allow students to insert or delete profiles", async () => {
    await asStudent(first);
    await expect(db.query("delete from public.profiles where id=$1", [first])).rejects.toThrow(/permission denied/i);
    await expect(db.query("insert into public.profiles(id) values ($1)", [second])).rejects.toThrow(/permission denied/i);
  });
  it("enforces rate limits atomically and permits the rate function only to the server role", async () => {
    await db.exec("set role service_role;");
    const call = () => db.query<{ allowed: boolean }>("select public.consume_auth_rate_limit('test-bucket', 2, 60) as allowed");
    expect((await call()).rows[0].allowed).toBe(true);
    expect((await call()).rows[0].allowed).toBe(true);
    expect((await call()).rows[0].allowed).toBe(false);
    await db.exec("set role authenticated;");
    await expect(call()).rejects.toThrow(/permission denied/i);
    await expect(db.query("select * from public.auth_rate_limits")).rejects.toThrow(/permission denied/i);
  });
});
