import { init } from "@instantdb/core"
import schema from "@/database/instant.schema"

export const db = init({
   appId: "7dd32a1c-bd35-4b41-8b27-8d095e072230",
   schema,
})
