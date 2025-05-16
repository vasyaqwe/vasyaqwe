import { type ID_PREFIXES, createId } from "@/id"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

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
