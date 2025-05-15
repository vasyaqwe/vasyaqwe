import type { DatabaseClient } from "@/database"
import { createEventListener } from "@solid-primitives/event-listener"
import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router"
import { getCurrentWindow } from "@tauri-apps/api/window"

export const Route = createRootRouteWithContext<{
   db: DatabaseClient
}>()({
   component: RootComponent,
   beforeLoad: async (opts) => {
      // await opts.context.db.execute(`DROP TABLE IF EXISTS "entry";`)
      await opts.context.db.execute(`
         CREATE TABLE IF NOT EXISTS "entry" (
            "id" text PRIMARY KEY NOT NULL,
            "content" text NOT NULL,
            "created_at" timestamp NOT NULL,
            "updated_at" timestamp NOT NULL
         );
      `)
      await opts.context.db.execute(`
         CREATE INDEX IF NOT EXISTS "entry_content_idx" ON "entry" USING btree ("content");
      `)
   },
})

function RootComponent() {
   createEventListener(window, "keydown", async (e) => {
      if (e.key === "W" && e.ctrlKey && e.shiftKey) {
         await getCurrentWindow().close()
      }
   })

   return <Outlet />
}
