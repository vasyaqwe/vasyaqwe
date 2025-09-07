import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router"

// biome-ignore lint/complexity/noBannedTypes: <>
export const Route = createRootRouteWithContext<{}>()({
   component: RootComponent,
})

function RootComponent() {
   return (
      <div class="relative grid min-h-svh place-items-center p-4">
         <Outlet />
      </div>
   )
}
