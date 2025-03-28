import { Link } from "@tanstack/solid-router"
import { buttonVariants } from "@vasyaqwe/ui/components/button"
import { cx } from "@vasyaqwe/ui/utils"

export function Sidebar() {
   return (
      <aside class="z-[10] h-svh w-[15rem] max-md:hidden">
         <div class="fixed flex h-full w-[15rem] flex-col border-neutral border-r shadow-xs">
            <nav class="overflow-y-auto p-4">
               <ul class="space-y-1">
                  <li>
                     <Link
                        to={"/"}
                        class={cx(
                           buttonVariants({ variant: "ghost" }),
                           "flex w-full justify-start gap-2 px-2 font-medium text-foreground/70 leading-none hover:text-foreground aria-[current=page]:text-foreground",
                        )}
                     >
                        <strong class="-mt-0.5 text-lg">{"{ }"}</strong> JSON
                        format/validate
                     </Link>
                  </li>
               </ul>
            </nav>
         </div>
      </aside>
   )
}
