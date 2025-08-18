import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { generateInvoiceNumber } from "./utils"

export const invoiceRouter = new Hono().post(
   "/generate",
   zValidator(
      "json",
      z.object({
         user: z.object({
            name: z.string().min(1),
            email: z.string().min(1),
         }),
         customer: z.object({
            name: z.string().min(1),
            email: z.string().min(1),
         }),
         amount: z.number(),
         selectedItems: z.array(
            z.object({ price: z.number(), description: z.string() }),
         ),
      }),
   ),
   async (c) => {
      const data = c.req.valid("json")

      const invoiceNumber = generateInvoiceNumber()
      const { generatePdf } = await import(
         // @ts-expect-error ...
         new URL("./pdf.mjs", import.meta.url)
      )

      const pdfStream = await generatePdf({
         amount: data.amount,
         dueDate: Date.now(),
         invoiceNumber,
         issueDate: Date.now(),
         lineItems: data.selectedItems.map((item) => ({
            name: item.description,
            price: item.price,
            quantity: 1,
         })),
         fromDetails: {
            content: [
               {
                  type: "paragraph",
                  content: [{ type: "text", text: data.user.name }],
               },
               {
                  type: "paragraph",
                  content: [{ type: "text", text: data.user.email }],
               },
            ],
            type: "doc",
         },
         customerDetails: {
            content: [
               {
                  type: "paragraph",
                  content: [{ type: "text", text: data.customer.name }],
               },
               {
                  type: "paragraph",
                  content: [{ type: "text", text: data.customer.email }],
               },
            ],
            type: "doc",
         },
         size: "a4",
      })

      const chunks: Buffer[] = []
      for await (const chunk of pdfStream) {
         chunks.push(Buffer.from(chunk))
      }

      const combinedBuffer = Buffer.concat(chunks)
      const base64Pdf = combinedBuffer.toString("base64")

      return c.json({
         base64Pdf,
         fileName: `invoice-${invoiceNumber}.pdf`,
      })
   },
)
