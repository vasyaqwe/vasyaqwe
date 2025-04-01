import { MainScrollArea } from "@/layout/components/main"
import { Editor } from "@/ui/components/editor"
import { createFileRoute } from "@tanstack/solid-router"
import { Button } from "@vasyaqwe/ui/components/button"
import { Separator } from "@vasyaqwe/ui/components/separator"
import { createSignal } from "solid-js"
import { toast } from "solid-sonner"

export const Route = createFileRoute("/_layout/")({
   component: RouteComponent,
})

function RouteComponent() {
   const [input, setInput] = createSignal("")
   const [output, setOutput] = createSignal("")

   const format = () => {
      try {
         const parsed = JSON.parse(input())
         const formatted = JSON.stringify(parsed, null, 2)
         setOutput(formatted)
      } catch (_e) {
         toast.error("Failed to parse JSON")
         setOutput("")
      }
   }

   return (
      <MainScrollArea class="grid lg:grid-cols-[35%_1px_1fr]">
         <div class="flex flex-col">
            <div class="flex h-[48px] shrink-0 items-center border-neutral border-b px-2">
               <Button onClick={format}>
                  Format <span class="text-[0.6rem]">▶</span>
               </Button>
            </div>
            <textarea
               placeholder="Paste JSON here.."
               value={input()}
               onChange={(e) => {
                  setInput(e.target.value)
               }}
               class="h-full resize-none px-3 py-2 font-mono focus:outline-hidden"
            />
         </div>{" "}
         <Separator class="h-full w-[1px] max-lg:hidden" />
         <div>
            <div class="flex h-[48px] shrink-0 items-center border-neutral border-b px-2">
               <Button
                  onClick={() => {
                     navigator.clipboard.writeText(output())
                     toast.success("Copied to clipboard")
                  }}
                  variant={"secondary"}
               >
                  Copy
               </Button>
            </div>
            <Editor
               height="calc(100svh - 48px)"
               value={output()}
            />
         </div>
      </MainScrollArea>
   )
}
