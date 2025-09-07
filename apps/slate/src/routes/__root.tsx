import { createEventListener } from "@solid-primitives/event-listener"
import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router"
import { getCurrentWindow } from "@tauri-apps/api/window"
import type { DatabaseClient } from "@/database"

export const Route = createRootRouteWithContext<{
   db: DatabaseClient
}>()({
   component: RootComponent,
})

function RootComponent() {
   createEventListener(window, "keydown", async (e) => {
      if (e.key === "W" && e.ctrlKey && e.shiftKey) {
         await getCurrentWindow().close()
      }
   })

   return <Outlet />
}
