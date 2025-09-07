import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createId, type ID_PREFIXES } from "@/id"

export const tableId = (prefix: keyof typeof ID_PREFIXES) =>
   text("id")
      .primaryKey()
      .$defaultFn(() => createId(prefix))

export const createTable = sqliteTable

export const timestamps = {
   createdAt: integer({ mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
   updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
}
