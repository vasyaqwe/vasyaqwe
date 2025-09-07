// @ts-nocheck
import NumberFlowLite, { define, formatToData } from "number-flow/lite"
import { createEffect, onMount } from "solid-js"

// Define the custom element once
class NumberFlowElement extends NumberFlowLite {
   static observedAttributes = ["data", "digits"]
   attributeChangedCallback(attr: string, _oldValue: string, newValue: string) {
      this[attr as keyof this] = JSON.parse(newValue)
   }
}

define("number-flow", NumberFlowElement)

type NumberFlowProps = {
   value: number
   locales?: Intl.LocalesArgument
   format?: Intl.NumberFormatOptions
   prefix?: string
   suffix?: string
   class?: string
   // biome-ignore lint/suspicious/noExplicitAny: <>
   [key: string]: any
}

const NumberFlow = (props: NumberFlowProps) => {
   let ref: NumberFlowElement

   onMount(() => {
      // Set up the formatter
      const formatter = new Intl.NumberFormat(props.locales, props.format)
      const data = formatToData(
         props.value,
         formatter,
         props.prefix,
         props.suffix,
      )

      // Set initial data
      ref.data = data
      if (props.digits) ref.digits = props.digits
   })

   createEffect(() => {
      if (!ref) return

      // Update data when value changes
      const formatter = new Intl.NumberFormat(props.locales, props.format)
      const data = formatToData(
         props.value,
         formatter,
         props.prefix,
         props.suffix,
      )
      ref.data = data
   })

   return (
      <number-flow
         ref={ref!}
         class={props.class}
      />
   )
}

export default NumberFlow
