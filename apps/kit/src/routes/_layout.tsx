import { Main } from "@/layout/components/main"
import { Sidebar } from "@/layout/components/sidebar"
import { Outlet, createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_layout")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <Sidebar />
         <Main>
            <div class={"relative flex grow flex-col"}>
               <Outlet />
            </div>
         </Main>
      </>
   )
}
