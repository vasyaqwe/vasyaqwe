import { i } from "@instantdb/core"

export const todo = i.entity({
   content: i.string(),
   done: i.boolean(),
   createdAt: i.date().indexed(),
   creatorId: i.string(),
})
