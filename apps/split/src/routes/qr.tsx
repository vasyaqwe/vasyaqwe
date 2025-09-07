import { createFileRoute, Link } from "@tanstack/solid-router"
import { createSignal, Show } from "solid-js"
import { qrCode, shareableLink } from "@/ui/store"

export const Route = createFileRoute("/qr")({
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

   return (
      <>
         <div class="absolute top-6 mx-auto w-[calc(100%-2.5rem)]">
            <Link
               to="/"
               class="flex aspect-square h-14 items-center justify-center gap-3 rounded-full bg-primary-2 px-6 font-medium text-lg shadow-md"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="-ml-2 size-6"
               >
                  <path
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
               </svg>
               Назад
            </Link>
         </div>
         <div class="text-center">
            <p class="mb-6 font-medium text-2xl">
               По ₴{search().amount} з людини
            </p>
            <Show when={qrCode()}>
               <div class="mb-6 flex justify-center">
                  <img
                     src={qrCode()}
                     alt="Payment QR Code"
                     class="rounded-3xl border"
                  />
               </div>
            </Show>
         </div>
         <button
            onClick={() => copyToClipboard(shareableLink())}
            class="absolute bottom-6 mx-auto flex h-14 w-[calc(100%-2.5rem)] items-center justify-center rounded-full bg-primary-2 font-medium text-lg shadow-md"
         >
            <Show
               when={copying()}
               fallback="Скопіювати посилання"
            >
               Скопійовано!
            </Show>
         </button>
      </>
   )
}
