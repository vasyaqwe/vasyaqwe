import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_layout/later")({
   component: RouteComponent,
})

function RouteComponent() {
   return <div>Hello "/_layout/later"!</div>
}
