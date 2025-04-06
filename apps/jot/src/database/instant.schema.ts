import { todo } from "@/todo/schema"
import { i } from "@instantdb/core"

const schema = i.schema({
   entities: {
      $files: i.entity({
         path: i.string().unique().indexed(),
         url: i.any(),
      }),
      $users: i.entity({
         email: i.string().unique().indexed(),
      }),
      todo,
   },
   links: {
      todoCreator: {
         forward: { on: "todo", has: "one", label: "creator" },
         reverse: { on: "$users", has: "many", label: "todo" },
      },
   },
})

export default schema
