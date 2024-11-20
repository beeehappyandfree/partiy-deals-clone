import { env } from "@/data/env/server"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  migrations: {
    prefix: "supabase",
  },
  strict: true,
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})