import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_layout/settings")({
   component: RouteComponent,
})

function RouteComponent() {
   return <div>Hello "/_layout/settings"!</div>
}
