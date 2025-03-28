import { MainScrollArea } from "@/layout/components/main"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_layout/")({
   component: RouteComponent,
})

function RouteComponent() {
   return <MainScrollArea>heloo</MainScrollArea>
}
