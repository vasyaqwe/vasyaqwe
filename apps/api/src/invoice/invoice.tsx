import { Document, Image, Page, Text, View } from "@react-pdf/renderer"
import { EditorContent } from "./components/editor-content.jsx"
import { LineItems } from "./components/line-items.jsx"
import { Meta } from "./components/meta.jsx"
import { Summary } from "./components/summary.jsx"

export function InvoicePdf({
   invoiceNumber,
   issueDate,
   dueDate,
   template,
   lineItems,
   customerDetails,
   fromDetails,
   amount,
   size = "a4",
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
   return (
      <Document>
         <Page
            size={size.toUpperCase()}
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
                     style={{ width: 78, height: 78 }}
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
