import { type VariantProps, cva } from "class-variance-authority"
import { type JSX, splitProps } from "solid-js"
import { FOCUS_STYLES } from "../constants"
import { cn } from "../utils"

export const buttonVariants = cva(
   [
      "inline-flex items-center justify-center whitespace-nowrap border text-[0.95rem] leading-none shadow-xs",
      "cursor-pointer disabled:opacity-80",
   ],
   {
      variants: {
         variant: {
            primary:
               "border-transparent bg-gradient-to-t from-primary-11 to-primary-9 text-white hover:from-primary-12 hover:to-primary-10 active:to-primary-11",
            secondary:
               "border-neutral bg-background hover:bg-primary-1 active:bg-primary-2/40",
            ghost: "!shadow-none border-transparent bg-transparent hover:border-primary-2 hover:bg-primary-1 aria-[current=page]:border-primary-2 aria-[current=page]:bg-primary-1",
         },
         size: {
            sm: "h-7 rounded-md",
            md: "h-8 rounded-lg",
            lg: "h-9 rounded-xl",
         },
         kind: {
            default: "gap-1.5 px-2.5",
            icon: "aspect-square w-auto justify-center",
         },
      },
      defaultVariants: {
         variant: "primary",
         size: "md",
         kind: "default",
      },
   },
)

interface ButtonProps
   extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
   class?: string
}

export function Button(props: ButtonProps) {
   const [local, rest] = splitProps(props, [
      "children",
      "class",
      "variant",
      "size",
      "kind",
   ])

   return (
      <button
         class={cn(
            buttonVariants({
               variant: local.variant,
               size: local.size,
               kind: local.kind,
               className: local.class,
            }),
            FOCUS_STYLES,
         )}
         {...rest}
      >
         {local.children}
      </button>
   )
}
