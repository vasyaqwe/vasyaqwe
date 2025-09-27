import { makePersisted } from "@solid-primitives/storage"
import { createFileRoute, useNavigate } from "@tanstack/solid-router"
import QRCode from "qrcode"
import { createMemo, createSignal, For, Show } from "solid-js"
import NumberFlow from "@/ui/components/number-flow"
import { setQRCode, setShareableLink } from "@/ui/store"

export const Route = createFileRoute("/")({
   component: RouteComponent,
})

const [cards, setCards] = makePersisted(createSignal<string[]>([]), {
   storage: localStorage,
   name: "cards",
})

function RouteComponent() {
   const navigate = useNavigate()
   const [amount, setAmount] = createSignal("")
   const [selectedCard, setSelectedCard] = createSignal("")
   const [newCard, setNewCard] = createSignal("")
   const [addingCard, setAddingCard] = createSignal(false)
   const [peopleCount, setPeopleCount] = createSignal(2)

   const amountPerPerson = createMemo(() => {
      return +(
         parseFloat(amount() === "" ? "0" : amount()) / peopleCount()
      ).toFixed(0)
   })

   const addCard = () => {
      if (newCard().trim() && !cards().includes(newCard().trim())) {
         setCards([...cards(), newCard().trim()])
         setSelectedCard(newCard().trim())
         setNewCard("")
         setAddingCard(false)
      }
   }

   const _removeCard = (cardToRemove: string) => {
      setCards(cards().filter((card) => card !== cardToRemove))
      if (selectedCard() === cardToRemove) {
         setSelectedCard(cards()[0] || "")
      }
   }

   const generatePaymentLink = async () => {
      const totalAmount = parseFloat(amount())
      const card = selectedCard()

      if (!totalAmount || !card) return

      const perPerson = (totalAmount / peopleCount()).toFixed(0)

      const params = new URLSearchParams({
         card: card,
         amount: perPerson,
         total: totalAmount.toFixed(2),
         people: peopleCount().toString(),
      })

      const link = `${window.location.origin}/pay?${params.toString()}`
      setShareableLink(link)

      try {
         const qr = await QRCode.toDataURL(link, { width: 300 })
         setQRCode(qr)
         navigate({
            to: "/qr",
            search: {
               card: card,
               amount: perPerson,
               total: totalAmount.toFixed(2),
               people: peopleCount(),
            },
         })
      } catch (err) {
         console.error("QR generation failed:", err)
      }
   }

   const isValid = () => amount() && selectedCard() && parseFloat(amount()) > 0

   const formatCard = (card: string) => {
      const cleanNumber = card.replace(/\D/g, "")
      const formattedNumber = cleanNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
      return formattedNumber
   }

   return (
      <>
         <div class="mx-auto w-full">
            <Show when={!addingCard()}>
               <div class="flex gap-3">
                  <div class="relative grow">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="pointer-events-none absolute inset-y-0 right-3.5 my-auto size-5 text-muted"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                     </svg>
                     <select
                        value={selectedCard()}
                        onChange={(e) => setSelectedCard(e.target.value)}
                        class="size-full appearance-none rounded-full border border-primary-6 bg-primary-4 px-5"
                     >
                        <option value="">Оберіть картку..</option>
                        <For each={cards()}>
                           {(card) => (
                              <option value={card}>{formatCard(card)}</option>
                           )}
                        </For>
                     </select>
                  </div>
                  <button
                     onClick={() => setAddingCard(true)}
                     class="flex aspect-square h-14 items-center justify-center rounded-full bg-primary-3 font-medium text-lg shadow-md transition-transform active:scale-[97%]"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M12 4.5v15m7.5-7.5h-15"
                        />
                     </svg>
                  </button>
               </div>
            </Show>

            <Show when={addingCard()}>
               <div class="flex gap-2">
                  <input
                     type="text"
                     value={newCard()}
                     onInput={(e) => setNewCard(e.target.value)}
                     placeholder="Уведіть номер картки"
                     class="h-14 w-full rounded-full border border-primary-6 bg-primary-4 px-5"
                  />
                  <button
                     onClick={addCard}
                     class="flex aspect-square h-14 items-center justify-center rounded-full border border-emerald-500 bg-emerald-600 font-medium text-lg shadow-md transition-transform active:scale-[97%]"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="m4.5 12.75 6 6 9-13.5"
                        />
                     </svg>
                  </button>
                  <button
                     onClick={() => {
                        setAddingCard(false)
                        setNewCard("")
                     }}
                     class="flex aspect-square h-14 items-center justify-center rounded-full border border-primary-6 bg-primary-4 font-medium text-lg shadow-md transition-transform active:scale-[97%]"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M6 18 18 6M6 6l12 12"
                        />
                     </svg>
                  </button>
               </div>
            </Show>
         </div>
         <div class="m-auto flex max-w-md flex-col items-center justify-center text-center">
            <div class="mb-8">
               <input
                  type="number"
                  step="0.01"
                  value={amount()}
                  onInput={(e) => setAmount(e.target.value)}
                  placeholder="Сума"
                  class="w-full text-center text-4xl focus:outline-hidden"
               />
            </div>
            <div class="w-full border-neutral border-t-2 border-dashed pt-8">
               <div class="flex items-center justify-center gap-3">
                  <button
                     onClick={() =>
                        setPeopleCount(Math.max(2, peopleCount() - 1))
                     }
                     class="grid size-14 place-content-center rounded-full border border-primary-6 bg-primary-4 transition-transform active:scale-[97%]"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M5 12h14"
                        />
                     </svg>
                  </button>
                  <span class="min-w-[4rem] text-center text-3xl">
                     {peopleCount()}
                  </span>
                  <button
                     onClick={() => setPeopleCount(peopleCount() + 1)}
                     class="grid size-14 place-content-center rounded-full border border-primary-6 bg-primary-4 transition-transform active:scale-[97%]"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M12 4.5v15m7.5-7.5h-15"
                        />
                     </svg>
                  </button>
               </div>
            </div>
            <p class="my-8 text-4xl text-muted">=</p>
            <NumberFlow
               value={amountPerPerson()}
               class="font-medium text-4xl"
               prefix={"₴ "}
            />
         </div>
         <button
            onClick={generatePaymentLink}
            disabled={!isValid()}
            class={
               "bottom-6 mx-auto flex h-14 w-full items-center justify-center rounded-full bg-primary-3 font-medium text-lg shadow-md transition-transform active:scale-[97%]"
            }
         >
            Згенерувати QR
         </button>
      </>
   )
}
