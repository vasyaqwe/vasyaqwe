import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router"

// biome-ignore lint/complexity/noBannedTypes: <>
export const Route = createRootRouteWithContext<{}>()({
   component: RootComponent,
})

function RootComponent() {
   return (
      <div class="relative flex min-h-svh flex-col p-4">
         <Outlet />
      </div>
   )
}
