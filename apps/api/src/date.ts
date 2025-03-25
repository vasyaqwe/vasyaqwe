export const formatDateIntl = (
   date: Date | string | number,
   options: Intl.DateTimeFormatOptions = {},
) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...options,
   }).format(new Date(date))

export const formatDate = (input: number) => {
   const date = new Date(input)

   const now = new Date()
   const yesterday = new Date(now)

   yesterday.setDate(now.getDate() - 1)

   const beforeYesterday = new Date(now)
   beforeYesterday.setDate(now.getDate() - 2)

   if (date.toDateString() === now.toDateString()) {
      return "Today"
   }
   if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
   }

   return formatDateIntl(input)
}
