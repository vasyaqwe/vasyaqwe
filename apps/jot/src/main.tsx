import "@vasyaqwe/ui/styles.css"
import "./ui/styles.css"
import { env } from "@/env"
import {
   ErrorComponent,
   type ErrorComponentProps,
   Link,
   RouterProvider,
   createRouter,
   useRouter,
} from "@tanstack/solid-router"
import { render } from "solid-js/web"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
   routeTree,
   defaultPreload: "render",
   scrollRestoration: true,
   defaultPreloadStaleTime: 0,
   defaultPendingMs: 0,
   defaultPendingMinMs: 0,
   defaultNotFoundComponent: NotFound,
   defaultErrorComponent: CatchBoundary,
})

function NotFound() {
   return (
      <div class="flex grow flex-col items-center justify-center pt-20 text-center md:pt-40">
         <h1 class="mb-2 font-semibold text-xl">Not found</h1>
         <p class="mb-5 text-lg leading-snug opacity-70">
            This page does not exist — <br /> it may have been moved or deleted.
         </p>
         <Link to={"/"}>Back home</Link>
      </div>
   )
}

function CatchBoundary({ error }: ErrorComponentProps) {
   const router = useRouter()

   return (
      <div class="flex grow flex-col items-center justify-center pt-20 text-center md:pt-40">
         <h1 class="mb-2 text-xl">An error occurred</h1>
         <p class="mb-5 text-lg leading-snug opacity-70">Please, try again.</p>
         <div class="flex items-center justify-center gap-2.5">
            <button
               onClick={() => {
                  router.invalidate()
               }}
            >
               Try Again
            </button>
         </div>
         {env.DEV ? (
            <div class="mx-auto mt-12 w-fit">
               <ErrorComponent error={error} />
            </div>
         ) : null}
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
