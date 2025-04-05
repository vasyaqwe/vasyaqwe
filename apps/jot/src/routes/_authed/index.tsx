import { db } from "@/database"
import { createQuery } from "@/database/store"
import { Command, CommandItem, CommandList } from "@/ui/components/command"
import { ErrorComponent } from "@/ui/components/error"
import { interactedWithCommand } from "@/ui/store"
import { createShortcut } from "@solid-primitives/keyboard"
import { createFileRoute } from "@tanstack/solid-router"
import { cx } from "@vasyaqwe/ui/utils"
import { For, Match, Switch, createDeferred, createSignal } from "solid-js"

export const Route = createFileRoute("/_authed/")({
   component: RouteComponent,
})

const [selectedId, setSelectedId] = createSignal("")
const [interactedViaShortcut, setInteractedViaShortcut] = createSignal(false)

function RouteComponent() {
   const query = createQuery({ todo: { $: { order: { createdAt: "desc" } } } })

   const deferredSelectedId = createDeferred(selectedId, { timeoutMs: 50 })

   createShortcut(
      ["Delete"],
      () => {
         if (!interactedWithCommand()) return
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

         const deleteTodo = async () => {
            setInteractedViaShortcut(true)
            await db.transact(toDelete.delete())
            setTimeout(() => {
               setInteractedViaShortcut(false)
            }, 100)
         }
         deleteTodo()
      },
      { preventDefault: true, requireReset: true },
   )

   return (
      <Switch>
         <Match when={query().error}>
            <ErrorComponent error={new Error(query().error?.message)} />
         </Match>
         <Match when={query().isLoading}>{null}</Match>
         <Match when={(query().data?.todo ?? 0) === 0}>
            <p class="mt-8 text-center font-secondary text-xl">Empty</p>
         </Match>
         <Match when={(query().data?.todo ?? []).length > 0}>
            <Command
               value={deferredSelectedId()}
               onValueChange={(v) => {
                  if (interactedViaShortcut()) return
                  setSelectedId(v)
               }}
               onBlur={() => setSelectedId("")}
            >
               <CommandList class="mt-8">
                  <For each={query().data?.todo}>
                     {(todo) => <TodoItem todo={todo} />}
                  </For>
               </CommandList>
            </Command>
         </Match>
      </Switch>
   )
}

function TodoItem({
   todo,
}: { todo: { id: string; content: string; done: boolean } }) {
   return (
      <CommandItem
         class={cx(
            "relative mt-5 block cursor-(--cursor) font-medium text-lg before:absolute before:inset-[-10px_-10px_-10px_-10px] before:rounded-xl before:transition-colors before:duration-50",
         )}
         value={todo.id}
         onSelect={() => {
            const toUpdate = db.tx.todo[todo.id]
            if (!toUpdate) return
            db.transact(toUpdate.update({ done: !todo.done }))
            setTimeout(() => {
               setSelectedId(todo.id)
            }, 0)
         }}
      >
         <div class="relative z-10 flex items-center rounded-xl">
            <input
               type="checkbox"
               class="appearance-none"
               checked={todo.done}
            />
            {todo.done ? <s>{todo.content}</s> : todo.content}
            {/* <Badge
         variant={"gradient"}
         class={cx("ml-auto")}
      >
         to watch
      </Badge> */}
         </div>
      </CommandItem>
   )
}
