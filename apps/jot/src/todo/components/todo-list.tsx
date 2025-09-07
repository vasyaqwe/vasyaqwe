import { createEventListener } from "@solid-primitives/event-listener"
import { createShortcut } from "@solid-primitives/keyboard"
import { Checkbox } from "@vasyaqwe/ui/components/checkbox"
import { MENU_ITEM_STYLES, POPUP_STYLES } from "@vasyaqwe/ui/constants"
import { cx } from "@vasyaqwe/ui/utils"
import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js"
import { db } from "@/database"
import { createQuery } from "@/database/store"
import type { Database } from "@/database/types"
import { Badge } from "@/ui/components/badge"
import { Button } from "@/ui/components/button"
import {
   Command,
   CommandItem,
   CommandList,
   ITEM_SELECTOR,
} from "@/ui/components/command"
import { ErrorComponent } from "@/ui/components/error"

const [selectedId, setSelectedId] = createSignal("")
const today = new Date()
today.setHours(0, 0, 0, 0)

const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

export function TodoList({ forToday = false }: { forToday?: boolean }) {
   const [selectedTags, setSelectedTags] = createSignal<string[]>([])
   const query = createQuery({
      todo: {
         $: {
            order: { createdAt: "desc" },
            where: {
               createdAt: forToday
                  ? { $gte: today.getTime(), $lt: tomorrow.getTime() }
                  : { $lt: today.getTime() },
            },
         },
      },
   })

   createShortcut(
      ["Delete"],
      () => {
         const data = query().data?.todo
         if (!data) return

         const selectedIndex = data.findIndex(
            (todo) => todo.id === selectedId(),
         )
         if (selectedIndex === -1) return

         const todoId = data[selectedIndex]?.id ?? ""
         const toDelete = db.tx.todo[todoId]
         if (!toDelete) return

         if (data.length > 1) {
            if (selectedIndex > 0 || selectedIndex === data.length - 1) {
               setSelectedId(data[selectedIndex - 1]?.id ?? "")
            } else {
               setSelectedId(data[selectedIndex + 1]?.id ?? "")
            }
         } else {
            setSelectedId("")
         }

         db.transact(toDelete.delete())
      },
      { requireReset: true },
   )
   createShortcut(
      ["d"],
      (e) => {
         if (document.activeElement?.nodeName === "TEXTAREA") return

         const data = query().data?.todo
         if (!data) return

         const todo = data.find((todo) => todo.id === selectedId())
         if (!todo) return

         const toUpdate = db.tx.todo[todo.id]
         if (!toUpdate) return

         e?.preventDefault()
         db.transact(toUpdate.update({ done: !todo.done }))
      },
      { preventDefault: false, requireReset: true },
   )

   let dialogRef: HTMLDialogElement | undefined
   const closeDialog = () => {
      dialogRef?.close()
   }

   createEventListener(document, "click", (e) => {
      if (e.target instanceof HTMLElement && !e.target.closest(ITEM_SELECTOR))
         setSelectedId("")
   })
   createEventListener(document, "click", (e) => {
      if (
         !e.target ||
         !(e.target instanceof HTMLElement) ||
         e.target.closest("[data-trigger]")
      )
         return

      if (e.target && dialogRef?.contains && !dialogRef.contains(e.target))
         closeDialog()
   })
   createShortcut(["Escape"], () => {
      setSelectedId("")
      closeDialog()
   })

   createShortcut(
      ["f"],
      (e) => {
         if (document.activeElement?.nodeName === "TEXTAREA") return
         e?.preventDefault()

         if (dialogRef?.hasAttribute("open")) return closeDialog()

         dialogRef?.show()
      },
      { preventDefault: false },
   )

   const data = createMemo(() => {
      const data = query().data?.todo ?? []

      return selectedTags().length === 0
         ? data
         : data.filter((todo) => selectedTags().some((tag) => todo.tag === tag))
   })

   const tags = createMemo(() => [
      ...new Set(
         (query().data?.todo ?? [])
            .map((todo) => todo.tag)
            .filter((tag) => tag !== undefined),
      ),
   ])

   return (
      <div class="mt-8">
         <Switch>
            <Match when={query().error}>
               <ErrorComponent error={new Error(query().error?.message)} />
            </Match>
            <Match when={query().isLoading}>{null}</Match>
            <Match when={data().length === 0}>
               <p class="mt-16 text-center font-secondary text-foreground/90 text-xl">
                  Empty
               </p>
            </Match>
            <Match when={data().length > 0}>
               <div class="relative mb-7">
                  <Button
                     data-trigger
                     variant={"secondary"}
                     onClick={() =>
                        dialogRef?.hasAttribute("open")
                           ? closeDialog()
                           : dialogRef?.show()
                     }
                  >
                     Filter..
                  </Button>
                  <dialog
                     ref={dialogRef}
                     class={cx(
                        POPUP_STYLES.base,
                        "absolute top-[calc(100%+0.25rem)] z-20 block w-60 origin-top-left scale-[97%] opacity-0 transition-[opacity,transform,scale] duration-150 [&:not([open])]:pointer-events-none [&[open]]:scale-100 [&[open]]:opacity-100",
                     )}
                  >
                     <Command>
                        <button
                           autofocus
                           class="sr-only"
                        />
                        <CommandList>
                           <For each={tags()}>
                              {(tag) => (
                                 <CommandItem
                                    class={cx(MENU_ITEM_STYLES.base)}
                                    value={tag}
                                    onSelect={() =>
                                       selectedTags().includes(tag)
                                          ? setSelectedTags((prev) =>
                                               prev.filter((t) => t !== tag),
                                            )
                                          : setSelectedTags((prev) => [
                                               ...prev,
                                               tag,
                                            ])
                                    }
                                 >
                                    <Checkbox
                                       checked={selectedTags().includes(tag)}
                                    />
                                    {tag}
                                 </CommandItem>
                              )}
                           </For>
                        </CommandList>
                     </Command>
                  </dialog>
               </div>
               <Command
                  main
                  value={selectedId()}
                  onValueChange={setSelectedId}
               >
                  <CommandList>
                     <For each={data()}>
                        {(todo) => <TodoItem todo={todo} />}
                     </For>
                  </CommandList>
               </Command>
            </Match>
         </Switch>
      </div>
   )
}

function TodoItem(props: { todo: Database["todo"] }) {
   return (
      <CommandItem
         class={
            "relative mt-3 flex min-h-7 cursor-(--cursor) items-center px-0 font-medium text-lg leading-none before:absolute before:inset-[-6px_-6px_-6px_-10px] before:rounded-[0.6rem] data-[selected]:before:bg-primary-2"
         }
         value={props.todo.id}
         onSelect={() => {
            const toUpdate = db.tx.todo[props.todo.id]
            if (!toUpdate) return
            db.transact(toUpdate.update({ done: !props.todo.done }))
            setTimeout(() => {
               setSelectedId(props.todo.id)
            }, 0)
         }}
      >
         <div class="relative z-10 flex w-full items-center rounded-xl">
            <span class="line-clamp-1 leading-5">
               {props.todo.done ? (
                  <s>{props.todo.content}</s>
               ) : (
                  props.todo.content
               )}
            </span>
            <Show when={props.todo.tag}>
               <Badge
                  variant={"gradient"}
                  class={"ml-auto"}
               >
                  {props.todo.tag ?? ""}
               </Badge>
            </Show>
         </div>
      </CommandItem>
   )
}
