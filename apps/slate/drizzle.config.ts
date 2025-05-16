import { defineConfig } from "drizzle-kit"
import { env } from "./src/env"

export default defineConfig({
   out: "./src-tauri/migrations",
   schema: "./src/database/schema.ts",
   dialect: "sqlite",
   dbCredentials: {
      url: env.DATABASE_URL,
   },
})
