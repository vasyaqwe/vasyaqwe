import { db } from "@/database"
import { Button } from "@/ui/components/button"
import { createFileRoute, useNavigate } from "@tanstack/solid-router"
import { tryCatch } from "@vasyaqwe/ui/utils"

export const Route = createFileRoute("/_authed/settings")({
   component: RouteComponent,
})

function RouteComponent() {
   const context = Route.useRouteContext()
   const navigate = useNavigate()

   return (
      <>
         <div class="mt-8">
            <h2 class="mt-5 font-secondary text-xl">Account</h2>
            <p class="mt-3 mb-6 text-foreground/75 text-sm">
               Logged in as {context().user.email}.
            </p>
            <Button
               onClick={async () => {
                  await tryCatch(db.auth.signOut())
                  navigate({ to: "/login" })
               }}
            >
               Log out
            </Button>
         </div>
         <div class="mt-8">
            <h2 class="mt-5 font-secondary text-xl">About</h2>
            <p class="mt-3 mb-6 text-foreground/75 text-sm">
               Hint: use up & down arrows to navigate through the todos. Hit
               Enter to toggle completion, and Delete to delete the selected
               todo.
            </p>
            <p class="mt-3 mb-6 text-foreground/75 text-sm">
               Jot is{" "}
               <a
                  href="https://github.com/vasyaqwe/vasyaqwe"
                  target="_blank"
                  rel="noreferrer"
                  class="duration-100 hover:text-foreground"
               >
                  <u>open source</u>
               </a>
               , created by{" "}
               <a
                  href="https://vasyaqwe.com"
                  target="_blank"
                  rel="noreferrer"
                  class="duration-100 hover:text-foreground"
               >
                  <u>vasyaqwe</u>
               </a>
               .
            </p>
         </div>
      </>
   )
}
