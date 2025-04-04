import { createFileRoute } from "@tanstack/solid-router"
import { Textarea } from "@vasyaqwe/ui/components/textarea"

export const Route = createFileRoute("/_layout/")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div class="container pt-4 pb-12 md:pt-5">
         <h1 class="font-secondary text-2xl">jot</h1>
         <Textarea />
      </div>
   )
}
