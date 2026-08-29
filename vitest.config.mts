import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Loads .env.local so integration tests (skipped when SUPABASE_URL is
    // unset) can reach the local Supabase instance without duplicating
    // config. See supabase-creator-repository.integration.test.ts.
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
