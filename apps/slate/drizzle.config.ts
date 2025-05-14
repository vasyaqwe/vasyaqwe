import { defineConfig } from "drizzle-kit"
import { env } from "./src/env"

export default defineConfig({
   out: "./src/database/migrations",
   schema: "./src/database/schema.ts",
   dialect: "postgresql",
   casing: "snake_case",
   dbCredentials: {
      url: env.DATABASE_URL,
   },
})
