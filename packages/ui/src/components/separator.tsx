import { type JSX, splitProps } from "solid-js"
import { cn } from "../utils"

export function Separator(props: JSX.HTMLAttributes<HTMLHRElement>) {
   const [local, rest] = splitProps(props, ["class"])

   return (
      <hr
         class={cn("h-px w-full border-transparent bg-neutral", local.class)}
         {...rest}
      />
   )
}
