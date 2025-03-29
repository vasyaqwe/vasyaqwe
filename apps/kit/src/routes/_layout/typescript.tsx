import { MainScrollArea } from "@/layout/components/main"
import { Editor } from "@/ui/components/editor"
import { createFileRoute } from "@tanstack/solid-router"
import { Button } from "@vasyaqwe/ui/components/button"
import { Separator } from "@vasyaqwe/ui/components/separator"
import { createSignal } from "solid-js"
import { toast } from "solid-sonner"

export const Route = createFileRoute("/_layout/typescript")({
   component: RouteComponent,
})

const jsonToTypeScriptType = (
   json: unknown,
   typeName = "Root",
   interfaces: Record<string, string> = {},
): string => {
   if (json === null) {
      return "null"
   }
   switch (typeof json) {
      case "string":
         return "string"
      case "number":
         return "number"
      case "boolean":
         return "boolean"
      case "object": {
         if (Array.isArray(json)) {
            if (json.length === 0) {
               return `${typeName}[]`
            }
            const itemType = jsonToTypeScriptType(json[0], typeName, interfaces)
            return `${itemType}[]`
         }
         const capitalizedTypeName = capitalize(typeName)
         if (interfaces[capitalizedTypeName]) {
            return capitalizedTypeName
         }
         const properties = Object.entries(json)
            .map(([key, value]) => {
               const propType = jsonToTypeScriptType(value, key, interfaces)
               return `${key}: ${propType};`
            })
            .join("\n   ")
         const interfaceDefinition = `export interface ${capitalizedTypeName} {\n   ${properties}\n}`
         interfaces[capitalizedTypeName] = interfaceDefinition
         return capitalizedTypeName
      }
      default:
         return "unknown"
   }
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const getAllInterfaces = (interfaces: Record<string, string>) => {
   const allInterfaces = Object.values(interfaces)
   allInterfaces.reverse()
   return allInterfaces.join("\n\n")
}

function RouteComponent() {
   const [input, setInput] = createSignal(`{"hello":{"yo":"yo"}}`)
   const [output, setOutput] = createSignal("")

   const format = () => {
      try {
         const parsed = JSON.parse(input())
         const interfaces: Record<string, string> = {}
         jsonToTypeScriptType(parsed, "Root", interfaces)
         const allInterfaces = getAllInterfaces(interfaces)
         setOutput(allInterfaces)
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
                  Convert <span class="text-[0.6rem]">▶</span>
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
         </div>
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
