import type schema from "@/database/instant.schema.ts"
import type { InstaQLEntity } from "@instantdb/core"

export type DatabaseSchema = typeof schema
export type Database = { todo: InstaQLEntity<typeof schema, "todo"> }
