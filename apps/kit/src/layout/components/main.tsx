import { cn } from "@vasyaqwe/ui/utils"
import type { ComponentProps } from "solid-js"

export function Main({ class: className, ...props }: ComponentProps<"main">) {
   return (
      <main
         class={
            "flex h-[calc(100svh-var(--bottom-navigation-height))] md:h-svh md:grow"
         }
         {...props}
      />
   )
}

export function MainScrollArea({
   class: className,
   ...props
}: ComponentProps<"div">) {
   return (
      <div
         class={cn("grow overflow-y-auto", className)}
         {...props}
      />
   )
}
