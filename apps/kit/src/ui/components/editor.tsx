import { cn } from "@vasyaqwe/ui/utils"
import type { ComponentProps } from "solid-js"
import { MonacoEditor } from "solid-monaco"

export function Editor(props: ComponentProps<typeof MonacoEditor>) {
   return (
      <MonacoEditor
         {...props}
         language="typescript"
         theme="vs-dark"
         options={{
            readOnly: true,
            minimap: { enabled: false },
            lineNumbersMinChars: 3,
         }}
         class={cn("overflow-auto py-2", props.class)}
      />
   )
}
