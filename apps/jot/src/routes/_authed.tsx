import { db } from "@/database"
import { buttonVariants } from "@/ui/components/button"
import { id } from "@instantdb/core"
import { Link, Outlet, createFileRoute } from "@tanstack/solid-router"
import { Textarea } from "@vasyaqwe/ui/components/textarea"
import { cn, formDataFromTarget } from "@vasyaqwe/ui/utils"
import { onMount } from "solid-js"

export const Route = createFileRoute("/_authed")({
   component: RouteComponent,
   beforeLoad: async () => {
      // const auth = await db.getAuth()
      // if (!auth) throw redirect({ to: "/login" })
   },
})

function RouteComponent() {
   let contentRef: HTMLTextAreaElement | undefined
   let formRef: HTMLFormElement | undefined

   onMount(() => {
      contentRef?.focus()

      const handle = () => {
         if (document.visibilityState === "visible") contentRef?.focus()
      }

      document.addEventListener("visibilitychange", handle)
      window.addEventListener("focus", () => contentRef?.focus())

      return () => {
         document.removeEventListener("visibilitychange", handle)
         window.removeEventListener("focus", () => contentRef?.focus())
      }
   })

   return (
      <div class="container pt-4 pb-12 md:pt-5">
         <div class="flex items-center justify-between">
            <h1 class="font-secondary text-2xl">jot</h1>
            <div class="mt-1 flex items-center gap-1">
               <Link
                  to="/"
                  class={cn(
                     buttonVariants({ variant: "ghost" }),
                     "font-medium text-foreground/80 aria-[current=page]:text-foreground",
                  )}
               >
                  Today
               </Link>
               <Link
                  to="/later"
                  class={cn(
                     buttonVariants({ variant: "ghost" }),
                     "font-medium text-foreground/80 aria-[current=page]:text-foreground",
                  )}
               >
                  Later
               </Link>
               <Link
                  to="/settings"
                  class={cn(
                     buttonVariants({ variant: "ghost" }),
                     "font-medium text-foreground/80 aria-[current=page]:text-foreground",
                  )}
               >
                  Settings
               </Link>
            </div>
         </div>
         <Outlet />
         <form
            ref={formRef}
            onKeyDown={(e) => {
               if (e.key === "Enter" && !e.shiftKey && !e.metaKey) {
                  e.preventDefault()
                  formRef?.requestSubmit()
                  formRef?.reset()
               }
            }}
            onSubmit={(e) => {
               e.preventDefault()
               const data = formDataFromTarget<{ content: string }>(e.target)
               const toInsert = db.tx.todo[id()]
               if (!toInsert) return
               db.transact(
                  toInsert.update({
                     content: data.content,
                     createdAt: Date.now(),
                     done: false,
                  }),
               )
            }}
            class="scrollbar-hidden container fixed inset-x-0 bottom-4 z-20 mx-auto md:bottom-6"
         >
            <Textarea
               autofocus
               ref={contentRef}
               name="content"
               placeholder="Jot something down.."
               class="max-h-[55svh] w-full resize-none overflow-y-auto rounded-[0.8rem] border border-primary-4 bg-primary-2 px-3 py-2.5 shadow-xs/5 transition-colors duration-100 placeholder:text-foreground/50 focus:border-primary-5 focus:outline-hidden"
            />
         </form>
      </div>
   )
}
