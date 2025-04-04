import { Command as CommandPrimitive } from "cmdk-solid"
import { type ComponentProps, onCleanup, onMount, splitProps } from "solid-js"

export function Command(props: ComponentProps<typeof CommandPrimitive>) {
   const [local, rest] = splitProps(props, ["children"])
   let inputRef: HTMLInputElement | undefined
   let cmdRootRef: HTMLDivElement | undefined

   onMount(() => {
      const keydown = (e: KeyboardEvent) => {
         if (!cmdRootRef) return

         if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault()
            inputRef?.focus()
            cmdRootRef.classList.add("interacted")
         } else if (e.key === "Escape") {
            cmdRootRef.classList.remove("interacted")
         }
      }
      const click = (e: MouseEvent) => {
         e.preventDefault()
         inputRef?.focus()
         cmdRootRef?.classList.add("interacted")
      }

      const handleBlur = (e: FocusEvent) => {
         const relatedTarget = e.relatedTarget as HTMLElement
         if (!relatedTarget || !relatedTarget.closest("[data-cmdk-item]")) {
            cmdRootRef?.classList.remove("interacted")
         }
      }

      document.addEventListener("keydown", keydown)
      cmdRootRef?.addEventListener("click", click)
      inputRef?.addEventListener("blur", handleBlur)

      onCleanup(() => {
         document.removeEventListener("keydown", keydown)
         cmdRootRef?.removeEventListener("click", click)
         inputRef?.removeEventListener("blur", handleBlur)
      })
   })

   return (
      <CommandPrimitive
         ref={cmdRootRef}
         shouldFilter={false}
         {...rest}
      >
         <CommandPrimitive.Input
            class="sr-only"
            ref={inputRef}
         />
         {local.children}
      </CommandPrimitive>
   )
}

export const CommandList = CommandPrimitive.List
export const CommandItem = CommandPrimitive.Item
export const CommandGroup = CommandPrimitive.Group
export const CommandSeparator = CommandPrimitive.Separator
