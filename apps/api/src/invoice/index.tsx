import type { EditorDoc, LineItem } from "./types"

export type Template = {
   logoUrl?: string
   fromLabel?: string
   customerLabel?: string
   invoiceNumberLabel?: string
   issueDateLabel?: string
   dueDateLabel?: string
   paymentLabel?: string
   noteLabel?: string
   descriptionLabel?: string
   quantityLabel?: string
   priceLabel?: string
   totalLabel?: string
}

type TemplateProps = {
   invoiceNumber: string
   issueDate: number
   dueDate: number
   template?: Template
   lineItems: LineItem[]
   customerDetails: EditorDoc
   fromDetails: EditorDoc
   amount: number
   customerName?: string
   size: "letter" | "a4"
}

// Font.register({
//    family: "geist_mono",
//    fonts: [
//       {
//          src: `https://tracker.vasyaqwe.com/font/geist_mono_regular.ttf`,
//          fontWeight: 400,
//       },
//       {
//          src: `https://tracker.vasyaqwe.com/font/geist_mono_medium.ttf`,
//          fontWeight: 500,
//       },
//    ],
// })

export async function InvoicePdf({
   invoiceNumber,
   issueDate,
   dueDate,
   template,
   lineItems,
   customerDetails,
   fromDetails,
   amount,
   size = "a4",
}: TemplateProps) {
   const { Document, Image, Page, Text, View } = await import(
      "@react-pdf/renderer"
   )

   const { EditorContent } = await import("./components/editor-content")
   const { LineItems } = await import("./components/line-items")
   const { Meta } = await import("./components/meta")
   const { Summary } = await import("./components/summary")

   return (
      <Document>
         <Page
            size={size.toUpperCase() as "LETTER" | "A4"}
            style={{
               padding: 20,
               backgroundColor: "#fff",
               fontFamily: "geist_mono",
               color: "#000",
            }}
         >
            <View style={{ marginBottom: 20 }}>
               {template?.logoUrl && (
                  <Image
                     src={template.logoUrl}
                     style={{
                        width: 78,
                        height: 78,
                     }}
                  />
               )}
            </View>

            <Meta
               invoiceNumberLabel={template?.invoiceNumberLabel}
               issueDateLabel={template?.issueDateLabel}
               dueDateLabel={template?.dueDateLabel}
               invoiceNumber={invoiceNumber}
               issueDate={issueDate}
               dueDate={dueDate}
            />

            <View style={{ flexDirection: "row" }}>
               <View style={{ flex: 1, marginRight: 10 }}>
                  <View style={{ marginBottom: 20 }}>
                     <Text style={{ fontSize: 9, fontWeight: 500 }}>
                        {template?.fromLabel ?? "From"}
                     </Text>
                     <EditorContent content={fromDetails} />
                  </View>
               </View>

               <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={{ marginBottom: 20 }}>
                     <Text style={{ fontSize: 9, fontWeight: 500 }}>
                        {template?.customerLabel ?? "To"}
                     </Text>
                     <EditorContent content={customerDetails} />
                  </View>
               </View>
            </View>

            <LineItems
               lineItems={lineItems}
               descriptionLabel={template?.descriptionLabel}
               quantityLabel={template?.quantityLabel}
               priceLabel={template?.priceLabel}
               totalLabel={template?.totalLabel}
            />

            <Summary
               amount={amount}
               totalLabel={template?.totalLabel}
            />
         </Page>
      </Document>
   )
}
