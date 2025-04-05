import type { ComponentProps } from "solid-js"
import { Command as CommandPrimitive } from "./command/internal"

export function Command(props: ComponentProps<typeof CommandPrimitive>) {
   return <CommandPrimitive {...props} />
}

export const CommandList = CommandPrimitive.List
export const CommandInput = CommandPrimitive.Input
export const CommandItem = CommandPrimitive.Item
export const CommandGroup = CommandPrimitive.Group
export const CommandSeparator = CommandPrimitive.Separator
