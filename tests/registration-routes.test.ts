import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn(), rpc: vi.fn(), info: vi.fn(), settings: vi.fn(), roleData: null as {user_id:string} | null }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: async () => ({ auth: mocks }) }));
vi.mock("@/lib/registration-server", async () => {
  const original = await vi.importActual<typeof import("@/lib/registration-server")>("@/lib/registration-server");
  return { ...original, serviceClient: () => ({ from: mocks.from, rpc: mocks.rpc, storage: { from: () => ({ info: mocks.info }) } }) };
});
// requireOrganiser uses serviceClient's actual lexical binding; isolate its
// underlying Supabase client so the real role check still runs, without a network.
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: mocks.from, rpc: mocks.rpc }) }));
import { GET as registrations, POST as register } from "@/app/api/registrations/route";
import { GET as organiser, POST as organiserAction } from "@/app/api/organiser/route";
const id="00000000-0000-4000-8000-000000000011";
const request=(body:unknown,origin="http://localhost:3000") => new Request("http://localhost:3000/api/organiser",{method:"POST",headers:{Origin:origin,"Content-Type":"application/json"},body:JSON.stringify(body)});
beforeEach(() => {
  vi.resetAllMocks(); mocks.roleData=null;
  vi.stubEnv("APP_URL","http://localhost:3000"); vi.stubEnv("SUPABASE_URL","https://example.supabase.co"); vi.stubEnv("SUPABASE_PUBLISHABLE_KEY","test"); vi.stubEnv("SUPABASE_SECRET_KEY","test-secret");
  mocks.getUser.mockResolvedValue({data:{user:{id,email:"student@example.com",email_confirmed_at:"2026-10-30"}},error:null});
  mocks.from.mockImplementation(() => ({select:vi.fn().mockReturnThis(),eq:vi.fn().mockReturnThis(),maybeSingle:async () => ({data:mocks.roleData,error:null}),order:async () => ({data:[],error:null})}));
});
describe("registration route boundaries", () => {
  it("refuses an unauthenticated visitor before reading registrations",async () => {
    mocks.getUser.mockResolvedValue({data:{user:null},error:null});
    expect((await registrations()).status).toBe(401); expect(mocks.from).not.toHaveBeenCalled();
  });
  it("always scopes the student list to the verified account",async () => {
    const eq=vi.fn().mockReturnThis(); mocks.from.mockReturnValue({select:vi.fn().mockReturnThis(),eq,order:async()=>({data:[],error:null})});
    expect((await registrations()).status).toBe(200); expect(eq).toHaveBeenCalledWith("user_id",id);
  });
  it("denies a normal student the organiser queue and review actions",async () => {
    expect((await organiser()).status).toBe(403);
    expect((await organiserAction(request({action:"review",id,version:1,decision:"approved",note:""}))).status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("rejects cross-site writes before any action",async () => {
    expect((await organiserAction(request({action:"review",id,version:1,decision:"approved",note:""},"https://evil.example"))).status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("refuses another student's receipt before any storage read or database write",async () => {
    const body={eventId:"blind-dates",teamName:"",members:[],profileConfirmed:true,transactionReference:"UTR123456",receiptPath:"00000000-0000-4000-8000-000000000099/receipt/00000000-0000-4000-8000-000000000088.jpg"};
    expect((await register(request(body))).status).toBe(400); expect(mocks.info).not.toHaveBeenCalled(); expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
