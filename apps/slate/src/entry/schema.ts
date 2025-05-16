import { createTable, tableId, timestamps } from "@/database/utils"
import type { InferSelectModel } from "drizzle-orm"
import { index, text } from "drizzle-orm/sqlite-core"

export const entry = createTable(
   "entry",
   {
      id: tableId("entry"),
      content: text().notNull(),
      ...timestamps,
   },
   (table) => [index("entry_content_idx").on(table.content)],
)

export type Entry = InferSelectModel<typeof entry>
