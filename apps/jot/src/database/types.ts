import type { InstaQLEntity } from "@instantdb/core"
import type schema from "@/database/instant.schema.ts"

export type DatabaseSchema = typeof schema
export type Database = { todo: InstaQLEntity<typeof schema, "todo"> }
