// Checkbox.tsx
import { type JSX, splitProps } from "solid-js"
import { cn } from "../utils"

interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox(props: CheckboxProps) {
   const [local, rest] = splitProps(props, ["class"])

   return (
      <div
         class={cn(
            "grid size-4 shrink-0 place-items-center rounded-sm border-primary-5 bg-background text-white shadow-xs",
            "border has-checked:border-accent-6 has-checked:bg-accent-6 dark:bg-primary-2",
            "has-disabled:opacity-50",
            local.class,
         )}
      >
         <input
            type="checkbox"
            class="peer sr-only"
            checked
            {...rest}
         />
         <svg
            class="hidden size-3.5 peer-checked:block"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M5 12.7132L10.0168 17.7247L10.4177 17.0238C12.5668 13.2658 15.541 10.0448 19.1161 7.60354L20 7"
               stroke="currentColor"
               stroke-width="3"
               stroke-linecap="round"
               stroke-linejoin="round"
            />
         </svg>
      </div>
   )
}
