import { renderToStream } from "@react-pdf/renderer"
import { InvoicePdf } from "./invoice.js"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function generatePdf(props: any) {
   return renderToStream(InvoicePdf(props))
}
