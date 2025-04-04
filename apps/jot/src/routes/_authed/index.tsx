import { db } from "@/database"
import { createQuery } from "@/database/store"
import { Command, CommandItem, CommandList } from "@/ui/components/command"
import { ErrorComponent } from "@/ui/components/error"
import { createFileRoute } from "@tanstack/solid-router"
import { cx } from "@vasyaqwe/ui/utils"
import { For, Match, Switch, createDeferred, createSignal } from "solid-js"

export const Route = createFileRoute("/_authed/")({
   component: RouteComponent,
})

function RouteComponent() {
   const query = createQuery({ todo: { $: { order: { createdAt: "desc" } } } })
   const [selectedId, setSelectedId] = createSignal("")
   const deferredSelectedId = createDeferred(selectedId, { timeoutMs: 50 })

   return (
      <Switch>
         <Match when={query().error}>
            <ErrorComponent error={new Error(query().error?.message)} />
         </Match>
         <Match when={query().isLoading}>{null}</Match>
         <Match when={query().data?.todo.length === 0}>
            <p class="mt-8 text-center font-secondary text-xl">Empty</p>
         </Match>
         <Match when={(query().data?.todo.length ?? 0) > 0}>
            <Command
               value={deferredSelectedId()}
               onValueChange={setSelectedId}
            >
               <CommandList class="mt-8">
                  <For each={query().data?.todo}>
                     {(todo) => (
                        <CommandItem
                           class={cx(
                              "relative mt-5 block cursor-pointer font-medium text-lg before:absolute before:inset-[-10px_-10px_-10px_-10px] before:rounded-xl before:transition-colors before:duration-50",
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
                     )}
                  </For>
               </CommandList>
            </Command>
         </Match>
      </Switch>
   )
}
