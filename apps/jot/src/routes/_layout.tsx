import { Outlet, createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_layout")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <Outlet />
      </>
   )
}
