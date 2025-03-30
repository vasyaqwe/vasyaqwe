import type { VariantProps } from "class-variance-authority"
import { type JSX, splitProps } from "solid-js"
import { FOCUS_STYLES } from "../constants"
import { cn } from "../utils"
import { buttonVariants } from "./button"

interface Props
   extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "size">,
      VariantProps<typeof buttonVariants> {}

export function Select(props: Props) {
   const [local, rest] = splitProps(props, [
      "children",
      "class",
      "variant",
      "size",
   ])

   return (
      <div class="relative">
         <select
            class={cn(
               buttonVariants({
                  variant: local.variant ?? "secondary",
                  size: local.size,
                  className: local.class,
               }),
               "w-full appearance-none pr-8 transition-all hover:bg-background",
               FOCUS_STYLES,
            )}
            {...rest}
         >
            {local.children}
         </select>
         <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="2"
               stroke="currentColor"
               class="size-4 text-foreground/75"
            >
               <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
               />
            </svg>
         </div>
      </div>
   )
}

export function SelectItem(props: JSX.OptionHTMLAttributes<HTMLOptionElement>) {
   const [local, rest] = splitProps(props, ["children", "class"])

   return (
      <option
         class={cn("cursor-default", local.class)}
         {...rest}
      >
         {local.children}
      </option>
   )
}

export function SelectGroup(
   props: JSX.OptgroupHTMLAttributes<HTMLOptGroupElement>,
) {
   const [local, rest] = splitProps(props, ["children", "class", "label"])

   return (
      <optgroup
         class={cn(local.class)}
         label={local.label ?? ""}
         {...rest}
      >
         {local.children}
      </optgroup>
   )
}
