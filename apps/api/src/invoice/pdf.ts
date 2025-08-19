import { InvoicePdf } from "./invoice"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function generatePdf(props: any) {
   const { renderToStream } = await import("@react-pdf/renderer")
   return renderToStream(InvoicePdf(props))
}
