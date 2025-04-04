import type { schema } from "@/database/schema"
import type { InstaQLEntity } from "@instantdb/core"

export type DatabaseSchema = typeof schema
export type Database = { todo: InstaQLEntity<typeof schema, "todo"> }
