import { formatDate } from "@/date"
import { type Entry, entry } from "@/entry/schema"
import { createEventListener } from "@solid-primitives/event-listener"
import { debounce } from "@solid-primitives/scheduled"
import { makePersisted } from "@solid-primitives/storage"
import { createFileRoute, useRouter } from "@tanstack/solid-router"
import { Separator } from "@vasyaqwe/ui/components/separator"
import { Textarea } from "@vasyaqwe/ui/components/textarea"
import { cx } from "@vasyaqwe/ui/utils"
import { and, desc, eq, gte, lt } from "drizzle-orm"
import {
   type Accessor,
   For,
   createEffect,
   createMemo,
   createSignal,
   onCleanup,
} from "solid-js"

export const Route = createFileRoute("/")({
   component: RouteComponent,
   loader: async (opts) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const [todaysEntry] = await opts.context.db
         .select({ id: entry.id })
         .from(entry)
         .where(and(gte(entry.createdAt, today), lt(entry.createdAt, tomorrow)))

      const entries = await opts.context.db
         .select()
         .from(entry)
         .orderBy(desc(entry.createdAt))

      return {
         todaysEntry,
         entries,
      }
   },
})

function RouteComponent() {
   const router = useRouter()
   const context = Route.useRouteContext()
   const data = Route.useLoaderData()
   const firstEntry = data().entries[0]
   const [content, setContent] = createSignal(firstEntry?.content ?? "")

   let contentRef!: HTMLTextAreaElement

   createEventListener(window, "focus", async () => {
      if (document.visibilityState === "visible")
         contentRef.focus({ preventScroll: true })
   })

   const debouncedContent = debounce(async (content: string) => {
      const todaysEntry = data().todaysEntry
      if (todaysEntry) {
         if (content === "") {
            await context().db.delete(entry).where(eq(entry.id, todaysEntry.id))
            return router.invalidate().then(() => setEntryInViewId("new-entry"))
         }
         await context()
            .db.insert(entry)
            .values({
               id: todaysEntry.id,
               content,
            })
            .onConflictDoUpdate({ target: entry.id, set: { content } })

         return router.invalidate()
      }

      if (content === "") return

      const [created] = await context()
         .db.insert(entry)
         .values({
            content,
         })
         .returning()

      router.invalidate().then(() => setEntryInViewId(created?.id))
   }, 500)

   const rest = data().todaysEntry ? data().entries.slice(1) : data().entries

   const groupedEntries = createMemo(() => {
      const groups = data().entries.reduce(
         (acc: Record<string, Entry[]>, entry) => {
            const monthKey = formatDate(entry.createdAt, {
               month: "short",
               year: "numeric",
            })

            if (!acc[monthKey]) {
               acc[monthKey] = []
            }

            acc[monthKey].push(entry)

            return acc
         },
         {},
      )

      return groups
   })

   let containerRef!: HTMLDivElement
   const activeLinkObserver = createActiveLinkObserver({
      firstId: firstEntry?.id ?? "",
      containerRef: () => containerRef,
   })

   return (
      <div class="flex">
         <aside class="sticky top-0 flex h-svh w-52 flex-col border-black border-r-[1.5px] bg-primary-11">
            <header class="relative flex items-center justify-between border-black border-b-[1.5px] p-4 shadow-md">
               <span class="h-4 w-1 rounded-[1px] bg-accent-6" />
               <p class="text-foreground/60 text-sm">
                  <b>{data().entries.length}</b>{" "}
                  {data().entries.length === 1 ? "entry" : "entries"}
               </p>
               {/* <div
class="absolute inset-x-0 top-full h-3/4 bg-gradient-to-b from-primary-11 to-transparent"
aria-hidden="true"
      /> */}
            </header>
            <div
               ref={containerRef}
               class="scrollbar-hidden relative grow overflow-y-auto p-4"
            >
               {data().entries.length === 0 ? null : (
                  <Separator
                     class={
                        "absolute top-0 left-4 h-px w-[calc(100%-7.5rem)] bg-destructive-6 transition-transform"
                     }
                     style={{
                        transform: `translateY(${activeLinkObserver.currentLinkY()}px)`,
                     }}
                  />
               )}
               <For each={Object.entries(groupedEntries())}>
                  {([month, entries]) => (
                     <div>
                        <p class="mb-3 text-right text-foreground/50 text-sm">
                           {month}
                        </p>
                        {data().todaysEntry ? null : (
                           <button
                              onClick={() => {
                                 document
                                    .getElementById("new-entry")
                                    ?.scrollIntoView({
                                       behavior: "smooth",
                                    })
                              }}
                              data-entry-id={"new-entry"}
                              class={cx(
                                 "grid w-full origin-right grid-cols-[1fr_5ch] items-center justify-items-end whitespace-nowrap py-2 text-right text-foreground/60 text-sm transition-transform hover:scale-x-[107%]",
                                 activeLinkObserver.entryInViewId() ===
                                    "new-entry" && "scale-x-[107%]",
                              )}
                           >
                              <Separator class="mr-1.5 w-6 shrink-0 bg-primary-9" />
                              <span class="mr-px">NEW</span>
                           </button>
                        )}
                        <For each={entries}>
                           {(entry) => {
                              return (
                                 <button
                                    onClick={() => {
                                       document
                                          .getElementById(entry.id)
                                          ?.scrollIntoView({
                                             behavior: "smooth",
                                          })
                                    }}
                                    data-entry-id={entry.id}
                                    class={cx(
                                       "grid w-full origin-right grid-cols-[1fr_2ch_3ch] items-center justify-items-end whitespace-nowrap py-2 text-right text-foreground/60 text-sm transition-transform hover:scale-x-[107%]",
                                       activeLinkObserver.entryInViewId() ===
                                          entry.id && "scale-x-[107%]",
                                    )}
                                 >
                                    <Separator class="mr-1.5 w-6 shrink-0 bg-primary-9" />
                                    <b class="mr-px">
                                       {formatDay(entry.createdAt)}{" "}
                                    </b>
                                    <span> {entry.createdAt.getDate()}</span>
                                 </button>
                              )
                           }}
                        </For>
                     </div>
                  )}
               </For>
            </div>
         </aside>
         <main class="mx-auto max-w-3xl grow px-4">
            <div
               class="min-h-svh py-[10svh]"
               data-entry
               id={data().todaysEntry?.id ?? "new-entry"}
            >
               <Textarea
                  ref={contentRef}
                  spellcheck={false}
                  autofocus
                  class="w-full resize-none placeholder:text-foreground/40 focus:outline-hidden"
                  placeholder="Type something.."
                  value={content()}
                  onInput={(e) => {
                     const value = e.target.value
                     setContent(value)
                     debouncedContent(value)
                  }}
               />
            </div>
            <For each={rest}>{(item) => <EntryContent item={item} />}</For>
         </main>
      </div>
   )
}

function EntryContent({ item }: { item: Entry }) {
   const [content] = createSignal(item.content)

   return (
      <div
         data-entry
         class="min-h-svh scroll-mt-[10svh]"
         id={item.id}
      >
         <p class="text-foreground/50 text-sm">{formatDate(item.createdAt)}</p>
         <Separator class="mt-4 mb-5 bg-black" />
         <p class="whitespace-pre">{content()}</p>
      </div>
   )
}

const [entryInViewId, setEntryInViewId] = makePersisted(
   createSignal<string | null>(),
   { storage: localStorage, name: "current_entry" },
)

function createActiveLinkObserver(props: {
   firstId: string
   containerRef: Accessor<HTMLDivElement>
}) {
   const [currentLinkY, setCurrentLinkY] = createSignal(0)

   createEffect(() => {
      const container = props.containerRef()
      const activeLink = container.querySelector(
         `[data-entry-id="${entryInViewId()}"]`,
      )
      if (!activeLink) return

      activeLink.scrollIntoView({ behavior: "smooth", block: "nearest" })

      const linkRect = activeLink.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const linkTopInContainerViewport = linkRect.top - containerRect.top
      const linkMiddleInContainerViewport =
         linkTopInContainerViewport + linkRect.height / 2
      const newValue = linkMiddleInContainerViewport + container.scrollTop

      setCurrentLinkY(newValue)
   })

   createEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            for (const entry of entries) {
               if (entry.isIntersecting) {
                  setEntryInViewId(entry.target.id)
               }
            }
         },
         {
            root: null,
            rootMargin: "0px",
            threshold: 0.8,
         },
      )

      const entryElements = document.querySelectorAll("[data-entry]")
      for (const el of entryElements) {
         observer.observe(el)
      }

      onCleanup(() => {
         observer.disconnect()
      })
   })

   return {
      entryInViewId,
      currentLinkY,
   }
}

const formatDay = (date: Date) => {
   const dayOfWeek = date.getDay()
   const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
   ]
   return dayNames[dayOfWeek]?.charAt(0) ?? ""
}
