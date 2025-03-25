import { Text, View } from "@react-pdf/renderer"
import type { EditorDoc } from "../types"
import { EditorContent } from "./editor-content"

export function Note({
   content,
   noteLabel = "Note",
}: {
   content?: EditorDoc
   noteLabel?: string
}) {
   if (!content) return null

   return (
      <View style={{ marginTop: 20 }}>
         <Text style={{ fontSize: 9, fontWeight: 500 }}>{noteLabel}</Text>
         <EditorContent content={content} />
      </View>
   )
}
