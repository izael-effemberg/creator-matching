/**
 * Server-only Supabase clients. `import "server-only"` makes any accidental
 * client-component import of this file fail the build instead of leaking
 * credentials to the browser (SDD §28: "service role nunca deve ser exposto
 * ao cliente").
 *
 * There is no login/session flow yet (see ADR-007, ADR-011) — the service
 * role client is what internal server-side code (Server Actions, Server
 * Components, future ingestion jobs) uses for now. It bypasses RLS entirely,
 * so every read/write path using it must apply its own authorization
 * checks in application code until real auth exists.
 */
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}" — see .env.example.`);
  }
  return value;
}

let serviceRoleClient: SupabaseClient<Database> | null = null;

/** Service-role client: bypasses RLS. Server-only code, internal use only. */
export function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
  if (!serviceRoleClient) {
    serviceRoleClient = createClient<Database>(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return serviceRoleClient;
}
