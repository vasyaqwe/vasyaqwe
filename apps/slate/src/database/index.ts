import { env } from "@/env"
import Database from "@tauri-apps/plugin-sql"
import { drizzle } from "drizzle-orm/sqlite-proxy"
import * as schema from "./schema"

/**
 * Represents the result of a SELECT query.
 */
export type SelectQueryResult = {
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   [key: string]: any
}

/**
 * Loads the sqlite database via the Tauri Proxy.
 */
// export const sqlite = await Database.load("sqlite:test.db");

export async function getDb() {
   return await Database.load(env.DATABASE_URL)
}

/**
 * The drizzle database instance.
 */
export const db = drizzle<typeof schema>(
   async (sql, params, method) => {
      const sqlite = await getDb()
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let rows: any = []
      let results = []

      // If the query is a SELECT, use the select method
      if (isSelectQuery(sql)) {
         rows = await sqlite.select(sql, params).catch((e) => {
            console.error("SQL Error:", e)
            return []
         })
      } else {
         // Otherwise, use the execute method
         rows = await sqlite.execute(sql, params).catch((e) => {
            console.error("SQL Error:", e)
            return []
         })
         return { rows: [] }
      }

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      rows = rows.map((row: any) => {
         return Object.values(row)
      })

      // If the method is "all", return all rows
      results = method === "all" ? rows : rows[0]
      await sqlite.close()
      return { rows: results }
   },
   // Pass the schema to the drizzle instance
   { schema: schema, logger: true },
)

/**
 * Checks if the given SQL query is a SELECT query.
 * @param sql The SQL query to check.
 * @returns True if the query is a SELECT query, false otherwise.
 */
function isSelectQuery(sql: string): boolean {
   const selectRegex = /^\s*SELECT\b/i
   return selectRegex.test(sql)
}

export type DatabaseClient = typeof db
