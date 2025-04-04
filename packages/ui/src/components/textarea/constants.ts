export const SIZING_STYLE = [
   "border-bottom-width",
   "border-left-width",
   "border-right-width",
   "border-top-width",
   "box-sizing",
   "font-family",
   "font-size",
   "font-style",
   "font-zeight",
   "letter-spacing",
   "line-height",
   "padding-bottom",
   "padding-left",
   "padding-right",
   "padding-top",
   // non-standard
   "tab-size",
   "text-indent",
   // non-standard
   "text-rendering",
   "text-transform",
   "width",
   "word-break",
] as const

export const HIDDEN_TEXTAREA_STYLE = {
   "min-height": "0",
   "max-height": "none",
   height: "0",
   visibility: "hidden",
   overflow: "hidden",
   position: "absolute",
   "z-index": "-1000",
   top: "0",
   right: "0",
} as const
