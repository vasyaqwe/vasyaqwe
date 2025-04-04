import { todo } from "@/todo/schema"
import { i } from "@instantdb/core"

export const schema = i.schema({
   entities: {
      todo,
   },
})
