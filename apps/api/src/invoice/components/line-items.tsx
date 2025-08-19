import { Text, View } from "@react-pdf/renderer"
import { formatCurrency } from "../../currency.js"
import type { LineItem } from "../types.js"

export function LineItems({
   lineItems,
   descriptionLabel = "Description",
   quantityLabel = "Quantity",
   priceLabel = "Price",
   totalLabel = "Total",
}: {
   lineItems: LineItem[]
   descriptionLabel?: string
   quantityLabel?: string
   priceLabel?: string
   totalLabel?: string
}) {
   return (
      <View style={{ marginTop: 20 }}>
         <View
            style={{
               flexDirection: "row",
               borderBottomWidth: 0.5,
               borderBottomColor: "#000",
               paddingBottom: 5,
               marginBottom: 5,
            }}
         >
            <Text style={{ flex: 3, fontSize: 9, fontWeight: 500 }}>
               {descriptionLabel}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
               {priceLabel}
            </Text>
            <Text style={{ flex: 0.5, fontSize: 9, fontWeight: 500 }}>
               {quantityLabel}
            </Text>
            <Text
               style={{
                  flex: 1,
                  fontSize: 9,
                  fontWeight: 500,
                  textAlign: "right",
               }}
            >
               {totalLabel}
            </Text>
         </View>
         {lineItems.map((item, index) => (
            <View
               key={`line-item-${index.toString()}`}
               style={{ flexDirection: "row", paddingVertical: 5 }}
            >
               <Text style={{ flex: 3, fontSize: 9 }}>{item.name}</Text>
               <Text style={{ flex: 1, fontSize: 9 }}>
                  {formatCurrency(item.price)}
               </Text>
               <Text style={{ flex: 0.5, fontSize: 9 }}>{item.quantity}</Text>
               <Text style={{ flex: 1, fontSize: 9, textAlign: "right" }}>
                  {formatCurrency(item.quantity * item.price)}
               </Text>
            </View>
         ))}
      </View>
   )
}
