import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_authed/later")({
   component: RouteComponent,
})

function RouteComponent() {
   return <div>Hello "/_layout/later"!</div>
}
