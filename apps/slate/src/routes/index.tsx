import { type Entry, entry } from "@/entry/schema"
import { debounce } from "@solid-primitives/scheduled"
import { Link, createFileRoute, useRouter } from "@tanstack/solid-router"
import { Separator } from "@vasyaqwe/ui/components/separator"
import { Textarea } from "@vasyaqwe/ui/components/textarea"
import { cx } from "@vasyaqwe/ui/utils"
import { and, desc, gte, lt } from "drizzle-orm"
import {
   type Accessor,
   For,
   createEffect,
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

   const debouncedContent = debounce(async (content: string) => {
      const todaysEntry = data().todaysEntry
      if (todaysEntry) {
         await context()
            .db.insert(entry)
            .values({
               id: todaysEntry.id,
               content,
            })
            .onConflictDoUpdate({ target: entry.id, set: { content } })

         return router.invalidate()
      }

      await context().db.insert(entry).values({
         content,
      })

      router.invalidate()
   }, 500)

   const rest = data().entries.slice(1)

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
               <p class="text-foreground/75 text-sm">
                  <b>{data().entries.length}</b> entries
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
               <Separator
                  class="absolute top-0 left-4 h-px w-[calc(100%-7.75rem)] bg-destructive-6 transition-transform"
                  style={{
                     transform: `translateY(${activeLinkObserver.currentLinkY()}px)`,
                  }}
               />
               <For each={data().entries}>
                  {(entry) => {
                     return (
                        <Link
                           to="."
                           hash={entry.id}
                           class={cx(
                              "grid w-full origin-right cursor-default grid-cols-[1fr_2ch_3ch] items-center justify-items-end whitespace-nowrap py-2 text-right text-foreground/75 text-sm transition-transform hover:scale-x-105",
                              activeLinkObserver.entryInViewId() === entry.id &&
                                 "scale-x-105",
                           )}
                        >
                           <Separator class="mr-1 w-8 shrink-0 bg-primary-9" />
                           <b class="mr-px">{formatDate(entry.createdAt)} </b>
                           <span> {entry.createdAt.getDate()}</span>
                        </Link>
                     )
                  }}
               </For>
            </div>
         </aside>
         <main class="mx-auto max-w-3xl grow divide-y divide-primary-10 px-4 py-[6vh]">
            <div
               class="py-10"
               id={firstEntry?.id}
            >
               <Textarea
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

function createActiveLinkObserver(props: {
   firstId: string
   containerRef: Accessor<HTMLDivElement | undefined>
}) {
   const [entryInViewId, setEntryInViewId] = createSignal<string | null>(
      props.firstId,
   )

   const [currentLinkY, setCurrentLinkY] = createSignal(0)
   createEffect(() => {
      const container = props.containerRef()
      if (!container) return

      const activeLink = container.querySelector(
         `a[href="/#${entryInViewId()}"]`,
      )
      if (!activeLink) return

      const linkRect = activeLink.getBoundingClientRect()
      const linkMiddle = linkRect.top + linkRect.height / 2
      const containerRect = container.getBoundingClientRect()
      setCurrentLinkY(linkMiddle - containerRect.top)
   })

   createEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            for (const entry of entries) {
               if (entry.isIntersecting) setEntryInViewId(entry.target.id)
            }
         },
         {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
         },
      )

      const entryElements = document.querySelectorAll("main .py-10")
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

function EntryContent({ item }: { item: Entry }) {
   const [content] = createSignal(item.content)

   return (
      <div
         class="py-10"
         id={item.id}
      >
         <p>{content()}</p>
      </div>
   )
}

const formatDate = (date: Date) => {
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
