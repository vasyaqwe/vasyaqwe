import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router"
import { Toaster } from "@vasyaqwe/ui/components/toast"

export const Route = createRootRouteWithContext()({
   component: RootComponent,
})

function RootComponent() {
   return (
      <>
         <Toaster />
         <Outlet />
      </>
   )
}
