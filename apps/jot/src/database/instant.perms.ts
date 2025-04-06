import type { InstantRules } from "@instantdb/core"

const rules = {
   todo: {
      allow: {
         view: "isOwner",
         create: "auth.id != null",
         update: "isOwner",
         delete: "isOwner",
      },
      bind: ["isOwner", "auth.id != null && auth.id == data.creatorId"],
   },
} satisfies InstantRules

export default rules
