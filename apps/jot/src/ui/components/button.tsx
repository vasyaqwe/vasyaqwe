import { FOCUS_STYLES } from "@vasyaqwe/ui/constants"
import { cn } from "@vasyaqwe/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { type JSX, splitProps } from "solid-js"

export const buttonVariants = cva(
   [
      "inline-flex cursor-(--cursor) items-center justify-center whitespace-nowrap text-base tracking-wide md:text-sm",
      "transition-colors duration-100 disabled:opacity-80",
   ],
   {
      variants: {
         variant: {
            primary:
               "bg-accent-6 font-[400] text-shadow-md text-white shadow-[inset_0_-2.5px_1px_0_var(--tw-shadow-color,rgb(0_0_0_/_0.2)),0_1px_3px_0_var(--tw-shadow-color,_rgb(0_0_0_/_0.1)),_0_1px_2px_-1px_var(--tw-shadow-color,_rgb(0_0_0_/_0.1))] hover:bg-accent-5 active:bg-accent-6",
            secondary:
               "border border-primary-5 bg-primary-3 text-shadow-xs shadow-[inset_0_-1.5px_1px_0_var(--tw-shadow-color,rgb(0_0_0_/_0.1)),0_1px_2px_0_var(--tw-shadow-color,_rgb(0_0_0_/_0.04)),_0_1px_2px_-1px_var(--tw-shadow-color,_rgb(0_0_0_/_0.04))] hover:border-primary-4 hover:bg-primary-2 active:bg-primary-3",
            ghost: "bg-transparent hover:bg-primary-2 aria-[current=page]:bg-primary-2",
            destructive: "bg-red-100 text-red-900 hover:bg-red-200/80",
         },
         size: {
            sm: "h-8 rounded-[0.5rem] px-2 md:h-7",
            md: "h-9 rounded-lg px-2.5 md:h-8",
            lg: "h-10 rounded-xl px-3 md:h-9",
         },
         kind: {
            default: "gap-2",
            icon: "aspect-square w-auto justify-center",
         },
         shape: {
            square: "",
            circle: "!rounded-full",
         },
      },
      defaultVariants: {
         variant: "primary",
         size: "sm",
         kind: "default",
         shape: "square",
      },
   },
)

interface Props
   extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {}

export function Button(props: Props) {
   const [local, rest] = splitProps(props, [
      "class",
      "variant",
      "size",
      "kind",
      "shape",
   ])

   return (
      <button
         class={cn(
            buttonVariants({
               variant: local.variant,
               size: local.size,
               kind: local.kind,
               shape: local.shape,
               className: local.class,
            }),
            FOCUS_STYLES,
         )}
         {...rest}
      />
   )
}
