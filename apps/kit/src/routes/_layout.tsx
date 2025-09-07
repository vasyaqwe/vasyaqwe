import { createFileRoute, Outlet } from "@tanstack/solid-router"
import { Main } from "@/layout/components/main"
import { Sidebar } from "@/layout/components/sidebar"

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
