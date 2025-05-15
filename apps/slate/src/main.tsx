import "@vasyaqwe/ui/styles.css"
import "./ui/styles.css"
import { databaseClient } from "@/database"
import { button } from "@/ui/components/button"
import { ErrorComponent } from "@/ui/components/error"
import { Link, RouterProvider, createRouter } from "@tanstack/solid-router"
import { render } from "solid-js/web"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
   routeTree,
   context: {
      db: databaseClient,
   },
   defaultPreload: "render",
   scrollRestoration: true,
   defaultPreloadStaleTime: 0,
   defaultPendingMs: 0,
   defaultPendingMinMs: 0,
   defaultNotFoundComponent: NotFound,
   defaultErrorComponent: ErrorComponent,
})

function NotFound() {
   return (
      <div class="flex grow flex-col items-center justify-center pt-20 text-center md:pt-40">
         <h1 class="mb-2 font-semibold text-xl">Not found</h1>
         <p class="mb-5 text-lg leading-snug opacity-70">
            This page does not exist — <br /> it may have been moved or deleted.
         </p>
         <Link
            to={"/"}
            class={button()}
         >
            Back home
         </Link>
      </div>
   )
}

declare module "@tanstack/solid-router" {
   interface Register {
      router: typeof router
   }
}

const rootElement = document.getElementById("app")
if (rootElement) {
   render(
      () => (
         <>
            <RouterProvider router={router} />
         </>
      ),
      rootElement,
   )
}
