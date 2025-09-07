import {
   createContext,
   createUniqueId,
   type JSX,
   splitProps,
   useContext,
} from "solid-js"
import { MENU_ITEM_STYLES, POPUP_STYLES } from "../constants"
import { cn } from "../utils"
import { Separator } from "./separator"

const MenuIdContext = createContext<string>("")

export function Menu(props: { id?: string; children: JSX.Element }) {
   const menuId = props.id || createUniqueId()

   return (
      <MenuIdContext.Provider value={menuId}>
         {props.children}
      </MenuIdContext.Provider>
   )
}

export function MenuPopup(props: JSX.HTMLAttributes<HTMLDivElement>) {
   const [local, rest] = splitProps(props, ["children", "class"])
   const menuId = useContext(MenuIdContext)

   return (
      <div
         popover="auto"
         id={menuId}
         class={cn(POPUP_STYLES.base, local.class)}
         style={
            {
               "position-anchor": `--${menuId}`,
            } as never
         }
         {...rest}
      >
         {local.children}
      </div>
   )
}

export function MenuTrigger(
   props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
   const [local, rest] = splitProps(props, ["children", "class"])
   const menuId = useContext(MenuIdContext)

   return (
      <button
         style={{ "anchor-name": `--${menuId}` } as never}
         popovertarget={menuId}
         class={cn("flex items-center justify-center", local.class)}
         {...rest}
      >
         {local.children}
      </button>
   )
}

interface MenuItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
   destructive?: boolean
}

export function MenuItem(props: MenuItemProps) {
   const [local, rest] = splitProps(props, ["children", "class", "destructive"])

   return (
      <div
         class={cn(
            MENU_ITEM_STYLES.base,
            local.destructive && MENU_ITEM_STYLES.destructive,
            local.class,
         )}
         {...rest}
      >
         {local.children}
      </div>
   )
}

export function MenuSeparator(props: JSX.HTMLAttributes<HTMLHRElement>) {
   const [local, rest] = splitProps(props, ["class"])

   return (
      <Separator
         class={cn(POPUP_STYLES.separator, local.class)}
         {...rest}
      />
   )
}

export function MenuGroup(props: JSX.HTMLAttributes<HTMLDivElement>) {
   const [local, rest] = splitProps(props, ["children", "class"])

   return (
      <div
         class={cn("", local.class)}
         {...rest}
      >
         {local.children}
      </div>
   )
}

export function MenuGroupLabel(props: JSX.HTMLAttributes<HTMLDivElement>) {
   const [local, rest] = splitProps(props, ["children", "class"])

   return (
      <div
         class={cn(
            "px-2 py-1.5 font-medium text-primary-7 text-xs",
            local.class,
         )}
         {...rest}
      >
         {local.children}
      </div>
   )
}
