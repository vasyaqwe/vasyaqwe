export const formatDate = (
   date: Date | string | number,
   options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
   },
) =>
   new Intl.DateTimeFormat("en-US", {
      ...options,
   }).format(new Date(date))
