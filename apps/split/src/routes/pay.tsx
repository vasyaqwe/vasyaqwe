import { createFileRoute } from "@tanstack/solid-router"
import { createSignal, Show } from "solid-js"
import privat from "@/assets/logo_Privat24.png"
import monobank from "@/assets/monobank.jpeg"

export const Route = createFileRoute("/pay")({
   component: RouteComponent,
   validateSearch: (search) => {
      return {
         card: search.card || "",
         amount: search.amount || "",
         total: search.total || "",
         people: parseInt(search.people as string, 10) || 0,
      } as {
         card: string
         amount: string
         total: string
         people: number
      }
   },
})

function RouteComponent() {
   const search = Route.useSearch()
   const [copying, setCopying] = createSignal(false)

   const copyToClipboard = async (text: string) => {
      try {
         await navigator.clipboard.writeText(text)
         setCopying(true)
         setTimeout(() => setCopying(false), 2000)
      } catch (err) {
         console.error("Failed to copy:", err)
      }
   }

   const generateMonobankLink = () => {
      return `https://send.monobank.ua/jar/send?amount=${search().amount}&card=${search().card}`
   }

   const generatePrivat24Link = () => {
      return `https://next.privat24.ua/mobile/payments/card?amount=${search().amount}&card=${search().card}`
   }

   return (
      <div class="w-full max-w-md text-center">
         <p class="mb-6 font-medium text-3xl">₴{search().amount}</p>
         <p class="mx-auto text-lg text-muted">
            За рахунок ₴{search().total} між {search().people} персонами
         </p>
         <div class="mt-8 w-full space-y-3 pb-5">
            <a
               target="_blank"
               href={generateMonobankLink()}
               class={
                  "flex h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-background text-xl shadow-md"
               }
            >
               <img
                  src={monobank}
                  alt="Pay with Monobank"
                  class="h-10.5 rounded-full"
               />
               monobank
            </a>
            <a
               target="_blank"
               href={generatePrivat24Link()}
               class={
                  "flex h-14 w-full items-center justify-center rounded-full bg-foreground font-medium text-background text-lg shadow-md"
               }
            >
               <img
                  src={privat}
                  alt="Pay with Privat24"
                  class="h-11"
               />
            </a>
         </div>
         <div class="border-neutral border-t-2 border-dashed pt-5">
            <div class="flex gap-3">
               <button
                  onClick={() => copyToClipboard(search().card)}
                  class="flex h-14 w-full items-center justify-center rounded-full bg-primary-2 font-medium text-lg shadow-md"
               >
                  <Show
                     when={copying()}
                     fallback="Скопіювати номер картки"
                  >
                     Скопійовано!
                  </Show>
               </button>
            </div>
         </div>
      </div>
   )
}
