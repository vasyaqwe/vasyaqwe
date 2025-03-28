import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "solid-js"
import { FOCUS_STYLES } from "../constants"
import { cn } from "../utils"

export const buttonVariants = cva(
   [
      "inline-flex items-center justify-center whitespace-nowrap border text-[0.95rem] leading-none shadow-xs",
      "transition-all hover:scale-[104%] hover:opacity-90 active:scale-[99%] disabled:opacity-80",
   ],
   {
      variants: {
         variant: {
            primary:
               "border-primary-12 bg-gradient-to-tr from-primary-11 to-primary-10 text-white",
            secondary: "border-neutral bg-background hover:bg-primary-1",
            ghost: "border-transparent bg-transparent shadow-none hover:border-primary-3 hover:bg-primary-2 aria-[current=page]:border-primary-3 aria-[current=page]:bg-primary-2",
         },
         size: {
            sm: "h-8 rounded-md px-2",
            md: "h-9 rounded-lg px-3",
            lg: "h-10 rounded-xl px-3",
         },
         kind: {
            default: "gap-1.5 px-3 md:px-2.5",
            icon: "aspect-square w-auto justify-center",
         },
      },
      compoundVariants: [
         {
            className: FOCUS_STYLES,
         },
      ],
      defaultVariants: {
         variant: "primary",
         size: "md",
         kind: "default",
      },
   },
)

interface Props
   extends ComponentProps<"button">,
      VariantProps<typeof buttonVariants> {
   class?: string
}

export function Button({
   class: className,
   variant,
   size,
   kind,
   ...props
}: Props) {
   return (
      <button
         class={cn(buttonVariants({ variant, size, kind, className }))}
         {...props}
      />
   )
}
