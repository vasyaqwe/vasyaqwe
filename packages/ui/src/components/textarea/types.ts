// TODO:  solid afaik does not have an equivalent to CSSStyleDeclaration

import type { JSX } from "solid-js/jsx-runtime"
import type { SIZING_STYLE } from "./constants"

//        replace this line once there is a proper solid equivalent
export type CSSStyleDeclarationSolid = {
   [Property in keyof JSX.CSSProperties]: string
}

export type SizingProps = Extract<
   (typeof SIZING_STYLE)[number],
   keyof CSSStyleDeclarationSolid
>

export type SizingStyle = Pick<CSSStyleDeclarationSolid, SizingProps>

export type SizingData = {
   sizingStyle: SizingStyle
   paddingSize: number
   borderSize: number
}
