import { MainScrollArea } from "@/layout/components/main"
import { Editor } from "@/ui/components/editor"
import { createFileRoute } from "@tanstack/solid-router"
import { Button } from "@vasyaqwe/ui/components/button"
import { Select, SelectItem } from "@vasyaqwe/ui/components/select"
import { Separator } from "@vasyaqwe/ui/components/separator"
import { createSignal } from "solid-js"
import { toast } from "solid-sonner"

export const Route = createFileRoute("/_layout/typescript")({
   component: RouteComponent,
})

type OutputKind = "type" | "interface"

const jsonToTypeScriptType = (
   json: unknown,
   options: {
      typeName?: string
      outputKind?: OutputKind
      interfaces?: Record<string, string>
   } = {},
): string => {
   const {
      typeName = "Root",
      outputKind = "interface",
      interfaces = {},
   } = options

   if (json === null) return "null"
   if (typeof json === "string") return "string"
   if (typeof json === "number") return "number"
   if (typeof json === "boolean") return "boolean"
   if (typeof json !== "object") return "unknown"

   if (Array.isArray(json)) {
      if (json.length === 0) return "any[]"
      const itemType = jsonToTypeScriptType(json[0], {
         typeName: `${typeName}Item`,
         outputKind,
         interfaces,
      })
      return `${itemType}[]`
   }

   const capitalizedTypeName = capitalize(typeName)

   // Avoid duplicate interface declarations
   if (interfaces[capitalizedTypeName]) return capitalizedTypeName

   // Add a placeholder to prevent circular references
   interfaces[capitalizedTypeName] = ""

   const properties = Object.entries(json as Record<string, unknown>)
      .map(([key, value]) => {
         // Handle special characters in property names
         const propertyName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
            ? key
            : `"${key}"`

         const propType = jsonToTypeScriptType(value, {
            typeName: `${capitalizedTypeName}${capitalize(key)}`,
            outputKind,
            interfaces,
         })

         return `  ${propertyName}: ${propType};`
      })
      .join("\n")

   if (outputKind === "type") {
      const typeDefinition = `export type ${capitalizedTypeName} = {\n${properties}\n}`
      interfaces[capitalizedTypeName] = typeDefinition
   } else {
      const interfaceDefinition = `export interface ${capitalizedTypeName} {\n${properties}\n}`
      interfaces[capitalizedTypeName] = interfaceDefinition
   }

   return capitalizedTypeName
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const getAllInterfaces = (interfaces: Record<string, string>) => {
   const allInterfaces = Object.values(interfaces)
   return allInterfaces.join("\n\n")
}

function RouteComponent() {
   const [input, setInput] = createSignal("")
   const [output, setOutput] = createSignal("")
   const [outputKind, setOutputKind] = createSignal<OutputKind>("type")

   const format = () => {
      try {
         const parsed = JSON.parse(input())
         const interfaces: Record<string, string> = {}
         jsonToTypeScriptType(parsed, {
            interfaces,
            outputKind: outputKind(),
            typeName: "Root",
         })
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
            <div class="flex h-[48px] shrink-0 items-center gap-2 border-neutral border-b px-2">
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
            <div class="flex h-[48px] shrink-0 items-center gap-2 border-neutral border-b px-2">
               <Button
                  onClick={() => {
                     navigator.clipboard.writeText(output())
                     toast.success("Copied to clipboard")
                  }}
                  variant={"secondary"}
               >
                  Copy
               </Button>
               <Select
                  value={outputKind()}
                  onChange={(e) => setOutputKind(e.target.value as never)}
               >
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="interface">Interface</SelectItem>
               </Select>
            </div>
            <Editor
               height="calc(100svh - 48px)"
               value={output()}
            />
         </div>
      </MainScrollArea>
   )
}
