import { type Entry, entry } from "@/entry/schema"
import { debounce } from "@solid-primitives/scheduled"
import { Link, createFileRoute, useRouter } from "@tanstack/solid-router"
import { Separator } from "@vasyaqwe/ui/components/separator"
import { Textarea } from "@vasyaqwe/ui/components/textarea"
import { and, desc, gte, lt } from "drizzle-orm"
import { For, createSignal } from "solid-js"

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

   return (
      <div class="flex">
         <aside class="sticky top-0 flex h-svh w-52 flex-col items-end border-black border-r-[1.5px] bg-primary-11/25 p-4">
            <p class="mb-7 text-primary-6 text-sm">
               <b>{data().entries.length}</b> entries
            </p>
            <For each={data().entries}>
               {(entry) => (
                  <Link
                     to="."
                     hash={entry.id}
                     class="flex cursor-default items-center gap-3 text-primary-6 text-sm"
                  >
                     <Separator class="w-8 border-primary-10" />
                     <span class="whitespace-nowrap">
                        <b>{formatDate(entry.createdAt)} </b>
                        {entry.createdAt.getDate()}
                     </span>
                  </Link>
               )}
            </For>
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
