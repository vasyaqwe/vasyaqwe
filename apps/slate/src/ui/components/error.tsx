import { env } from "@/env"
import { Button } from "@/ui/components/button"
import {
   type ErrorComponentProps,
   ErrorComponent as RouterErrorComponent,
   useRouter,
} from "@tanstack/solid-router"

export function ErrorComponent({ error }: Omit<ErrorComponentProps, "reset">) {
   const router = useRouter()
   console.log(error)
   return (
      <div class="flex grow flex-col items-center justify-center pt-20 text-center md:pt-40">
         <p class="mb-3 font-secondary text-2xl">An error occurred</p>
         <p class="mb-5 text-lg leading-snug opacity-70">Please, try again.</p>
         <div class="flex items-center justify-center gap-2.5">
            <Button onClick={() => router.invalidate()}>Try Again</Button>
         </div>
         {env.DEV ? (
            <div class="mx-auto mt-12 w-fit">
               <RouterErrorComponent error={error} />
            </div>
         ) : null}
      </div>
   )
}
