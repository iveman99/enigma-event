import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ session: vi.fn(), signed: vi.fn(), from: vi.fn() }));
vi.mock("@/lib/auth/profile", () => ({ requireVerifiedSession: mocks.session }));
vi.mock("@/lib/registration-server", () => ({ serviceClient: () => ({from:mocks.from}), signedDocument:mocks.signed, DOCUMENT_BUCKET:"documents", limitUploads:vi.fn(), requireOrganiser:vi.fn() }));
import { GET, POST } from "@/app/api/documents/route";
const id="00000000-0000-4000-8000-000000000011";
const path=`${id}/receipt/00000000-0000-4000-8000-000000000012.jpg`;
beforeEach(() => {vi.resetAllMocks();vi.stubEnv("APP_URL","http://localhost");mocks.session.mockResolvedValue({user:{id}});mocks.signed.mockResolvedValue("https://storage.example/private-preview");});
describe("private upload previews", () => {
  it("rejects uploads over 1 MB before storage access", async () => {
    const form = new FormData(); form.set("kind", "receipt");
    form.set("file", new File([new Uint8Array(1048577)], "oversize.png", {type:"image/png"}));
    const response = await POST(new Request("http://localhost/api/documents", {method:"POST",headers:{Origin:"http://localhost"},body:form}));
    expect(response.status).toBe(400);expect(mocks.from).not.toHaveBeenCalled();
  });
  it("signs only the owner's document", async () => {
    const response=await GET(new Request(`http://localhost/api/documents?kind=receipt&path=${path}`));
    expect(response.status).toBe(200);expect(mocks.signed).toHaveBeenCalledWith(path);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });
  it("rejects foreign files, traversal and unrelated document kinds", async () => {
    for(const query of [`kind=receipt&path=${path.replace(id,"00000000-0000-4000-8000-000000000099")}`,`kind=receipt&path=${id}/receipt/../../secret.jpg`,"kind=qr&path=anything",`kind=id&path=${path}`]) {
      expect((await GET(new Request(`http://localhost/api/documents?${query}`))).status).toBeGreaterThanOrEqual(400);
    }
    expect(mocks.signed).not.toHaveBeenCalled();
  });
  it("loads the current ID from the owner's profile", async () => {
    const idPath=path.replace("/receipt/","/id/");const eq=vi.fn().mockReturnThis();
    mocks.from.mockReturnValue({select:vi.fn().mockReturnThis(),eq,single:async()=>({data:{id_card_path:idPath},error:null})});
    expect((await GET(new Request("http://localhost/api/documents?kind=id"))).status).toBe(200);
    expect(eq).toHaveBeenCalledWith("id",id);expect(mocks.signed).toHaveBeenCalledWith(idPath);
  });
});
