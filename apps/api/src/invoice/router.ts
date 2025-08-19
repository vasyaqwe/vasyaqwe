import crypto from "node:crypto"
import { zValidator } from "@hono/zod-validator"
import baseX from "base-x"
import { Hono } from "hono"
import { z } from "zod"

export const b58 = baseX(
   "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
)

export const generateInvoiceNumber = () => {
   const date = new Date()
   const year = date.getFullYear().toString().slice(-2)
   const month = (date.getMonth() + 1).toString().padStart(2, "0")
   const day = date.getDate().toString().padStart(2, "0")
   const random = b58
      .encode(crypto.getRandomValues(new Uint8Array(3)))
      .toUpperCase()

   return `${year}${month}${day}-${random}`
}

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
      const { generatePdf } = await import("./pdf.js")

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

      const chunks = []
      for await (const chunk of pdfStream) {
         // @ts-expect-error ...
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
