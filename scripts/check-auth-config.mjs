import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
let missing = false;
for (const name of ["APP_URL", "SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"]) {
  const value = process.env[name];
  let valid = Boolean(value && !value.includes("YOUR_") && !value.startsWith("your-"));
  if (valid && name.endsWith("URL")) {
    try {
      const url = new URL(value);
      valid = url.protocol === "https:" || ["localhost", "127.0.0.1"].includes(url.hostname);
    } catch { valid = false; }
  }
  console.log(name + ": " + (valid ? "configured" : "missing or placeholder"));
  missing ||= !valid;
}
console.log("Provider secrets and Brevo SMTP settings must be configured in Supabase separately.");
process.exitCode = missing ? 1 : 0;
