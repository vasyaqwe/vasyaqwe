import type { JSX } from "solid-js"
import { cn } from "../utils"

export function Separator({
   class: className,
   ...props
}: JSX.HTMLAttributes<HTMLHRElement>) {
   return (
      <hr
         class={cn("h-px w-full border-neutral", className)}
         {...props}
      />
   )
}
