import { db } from "@/database"
import { env } from "@/env"
import { buttonVariants } from "@/ui/components/button"
import { id } from "@instantdb/core"
import { createEventListener } from "@solid-primitives/event-listener"
import { createShortcut } from "@solid-primitives/keyboard"
import {
   Link,
   Outlet,
   createFileRoute,
   redirect,
   useNavigate,
} from "@tanstack/solid-router"
import { Textarea } from "@vasyaqwe/ui/components/textarea"
import { MOBILE_BREAKPOINT } from "@vasyaqwe/ui/constants"
import { cn, formDataFromTarget } from "@vasyaqwe/ui/utils"

export const Route = createFileRoute("/_authed")({
   component: RouteComponent,
   beforeLoad: async () => {
      const user = await db.getAuth()
      if (!user) throw redirect({ to: "/login" })

      return { user }
   },
})

function RouteComponent() {
   const context = Route.useRouteContext()
   const navigate = useNavigate()
   let contentRef: HTMLTextAreaElement | undefined
   let formRef: HTMLFormElement | undefined

   createEventListener(document, "visibilitychange", () => {
      if (
         document.visibilityState === "visible" &&
         window.innerWidth > MOBILE_BREAKPOINT
      )
         contentRef?.focus()
   })
   createEventListener(window, "focus", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) contentRef?.focus()
   })

   createShortcut(
      ["1"],
      (e) => {
         if (document.activeElement?.nodeName === "TEXTAREA") return
         e?.preventDefault()
         navigate({ to: "/" })
      },
      { preventDefault: false },
   )
   createShortcut(
      ["2"],
      (e) => {
         if (document.activeElement?.nodeName === "TEXTAREA") return
         e?.preventDefault()
         navigate({ to: "/later" })
      },
      { preventDefault: false },
   )
   createShortcut(
      ["3"],
      (e) => {
         if (document.activeElement?.nodeName === "TEXTAREA") return
         e?.preventDefault()
         navigate({ to: "/settings" })
      },
      { preventDefault: false },
   )

   return (
      <div class="container pt-4 pb-12 md:pt-5">
         <div class="flex items-center justify-between">
            <h1 class="font-secondary text-2xl">jot</h1>
            <div class="mt-1 flex items-center gap-1">
               <Link
                  to="/"
                  class={cn(
                     buttonVariants({ variant: "ghost" }),
                     "text-foreground/80 aria-[current=page]:text-foreground",
                  )}
               >
                  Today
               </Link>
               <Link
                  to="/later"
                  class={cn(
                     buttonVariants({ variant: "ghost" }),
                     "text-foreground/80 aria-[current=page]:text-foreground",
                  )}
               >
                  Later
               </Link>
               <Link
                  to="/settings"
                  class={cn(
                     buttonVariants({ variant: "ghost" }),
                     "text-foreground/80 aria-[current=page]:text-foreground",
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
            onSubmit={async (e) => {
               e.preventDefault()
               const data = formDataFromTarget<{ content: string }>(e.target)
               if (data.content.trim().length === 0) return
               const newId = id()
               const toInsert = db.tx.todo[newId]
               if (!toInsert) return

               db.transact(
                  toInsert
                     .update({
                        content: data.content,
                        createdAt: Date.now(),
                        done: false,
                        creatorId: context().user.id,
                     })
                     .link({ creator: context().user.id }),
               )

               const res = await fetch(`${env.WORKER_URL}/generate-tag`, {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ input: data.content }),
               }).then((res) => res.json() as Promise<{ response: string }>)

               const toUpdate = db.tx.todo[newId]
               if (!toUpdate) return
               db.transact(toUpdate.update({ tag: res.response }))
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
