export const MOBILE_BREAKPOINT = 768

export const FOCUS_STYLES =
   "focus-visible:border-foreground/90 focus-visible:ring-foreground/20 focus-visible:ring-[3px] focus-visible:outline-hidden"

export const POPUP_STYLES = {
   base: "[--popup-radius:var(--radius-xl)] rounded-(--popup-radius) md:[--popup-radius:var(--radius-xl)] p-[var(--popup-padding)] bg-primary-1 shadow-md outline-1 outline-primary-4 outline-offset-0 w-40",
   separator:
      "-mx-(--popup-padding) mt-0.5 mb-1 h-px w-[calc(100%+calc(var(--popup-padding)*2))] bg-neutral",
   groupLabel: "my-1 ml-2 text-sm text-foreground/75 uppercase",
}

export const MENU_ITEM_STYLES = {
   base: "cursor-(--cursor) text-base md:text-sm h-9 md:h-8 flex items-center select-none gap-2 rounded-[calc(var(--popup-radius)-var(--popup-padding))] px-2.5 md:px-2 py-4 focus-visible:border-transparent [&>svg]:size-[22px] md:[&>svg]:size-5 [&>svg]:text-foreground/75 hover:bg-primary-2 focus-visible:outline-hidden focus-visible:bg-primary-2 data-[selected]:bg-primary-2",
   destructive: "hover:bg-red-200 focus-visible:bg-red-200",
}
