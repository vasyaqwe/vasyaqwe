import type { ComponentProps } from "solid-js"
import { cn } from "../utils"

export function Separator({
   class: className,
   ...props
}: ComponentProps<"span">) {
   return (
      <span
         class={cn("h-px w-full bg-neutral", className)}
         {...props}
      />
   )
}
