import { type ID_PREFIXES, createId } from "@/id"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const tableId = (prefix: keyof typeof ID_PREFIXES) =>
   text("id")
      .primaryKey()
      .$defaultFn(() => createId(prefix))

export const createTable = pgTable

export const timestamps = {
   createdAt: timestamp()
      .$defaultFn(() => new Date())
      .notNull(),
   updatedAt: timestamp()
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
}
