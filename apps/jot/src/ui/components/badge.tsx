import { tagGradient } from "@/tag/utils"
import { cn } from "@vasyaqwe/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { type JSX, splitProps } from "solid-js"

export const badgeVariants = cva(
   "inline-flex items-center justify-center gap-2 whitespace-nowrap border font-medium text-sm shadow-[inset_0_-1px_1px_0_var(--tw-shadow-color,rgb(0_0_0_/_0.1)),0_1px_2px_0_var(--tw-shadow-color,_rgb(0_0_0_/_0.025)),_0_1px_2px_-1px_var(--tw-shadow-color,_rgb(0_0_0_/_0.025))]",
   {
      variants: {
         variant: {
            primary: "border-neutral bg-background text-foreground/80",
            gradient: "border-neutral text-foreground/80",
            destructive: "border-transparent bg-red-500 text-red-900 shadow-xs",
         },
         size: {
            sm: "h-8 rounded-[0.5rem] px-2.5 md:h-7",
            md: "h-9 rounded-lg px-3 md:h-8",
            lg: "h-10 rounded-xl px-3 md:h-9",
         },
      },
      defaultVariants: {
         variant: "primary",
         size: "sm",
      },
   },
)

interface Props
   extends JSX.ButtonHTMLAttributes<HTMLSpanElement>,
      VariantProps<typeof badgeVariants> {}

export function Badge(props: Props) {
   const [local, rest] = splitProps(props, ["class", "variant", "size"])
   const [fromColor, toColor] = tagGradient(props.children as string)

   return (
      <span
         class={cn(
            badgeVariants({
               variant: local.variant,
               size: local.size,
               className: local.class,
            }),
         )}
         style={{
            background:
               local.variant === "gradient"
                  ? `linear-gradient(to right, ${fromColor}, ${toColor})`
                  : undefined,
         }}
         {...rest}
      />
   )
}
