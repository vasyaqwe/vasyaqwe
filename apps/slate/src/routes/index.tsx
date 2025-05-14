import { createFileRoute } from "@tanstack/solid-router"
import { Textarea } from "@vasyaqwe/ui/components/textarea"

export const Route = createFileRoute("/")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div class="flex">
         <aside class="h-svh w-52 border-primary-10 border-r bg-primary-11 p-4">
            <p class="text-primary-3 text-sm">225 entries</p>
         </aside>
         <main class="mx-auto max-w-3xl grow px-4 py-[10vh]">
            <Textarea
               spellcheck={false}
               autofocus
               class="w-full resize-none focus:outline-hidden"
               placeholder="Type something.."
            />
         </main>
      </div>
   )
}
