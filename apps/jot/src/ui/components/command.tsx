import { setInteractedWithCommand } from "@/ui/store"
import { createEventListener } from "@solid-primitives/event-listener"
import { useKeyDownEvent } from "@solid-primitives/keyboard"
import { Command as CommandPrimitive } from "cmdk-solid"
import { type ComponentProps, createEffect, splitProps } from "solid-js"

export function Command(props: ComponentProps<typeof CommandPrimitive>) {
   const [local, rest] = splitProps(props, ["children"])
   let inputRef: HTMLInputElement | undefined
   let cmdRootRef: HTMLDivElement | undefined

   const event = useKeyDownEvent()
   createEffect(() => {
      const e = event()
      if (!e || !cmdRootRef) return

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
         e.preventDefault()
         inputRef?.focus()
         cmdRootRef.classList.add("interacted")
         return setInteractedWithCommand(true)
      }
      if (e.key === "Escape") {
         cmdRootRef.classList.remove("interacted")
         setInteractedWithCommand(false)
      }
   })

   createEventListener(
      () => cmdRootRef,
      "click",
      (e) => {
         e.preventDefault()
         inputRef?.focus()
         cmdRootRef?.classList.add("interacted")
         setInteractedWithCommand(true)
      },
   )
   createEventListener(
      () => inputRef,
      "blur",
      (e) => {
         const relatedTarget = e.relatedTarget as HTMLElement
         if (!relatedTarget || !relatedTarget.closest("[data-cmdk-item]")) {
            cmdRootRef?.classList.remove("interacted")
            setInteractedWithCommand(false)
         }
      },
   )

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
