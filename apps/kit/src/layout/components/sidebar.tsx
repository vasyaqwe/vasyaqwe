import { Link } from "@tanstack/solid-router"
import { button } from "@vasyaqwe/ui/components/button"
import { cx } from "@vasyaqwe/ui/utils"

export function Sidebar() {
   return (
      <aside class="z-[10] h-svh w-[15rem] max-lg:hidden">
         <div class="fixed flex h-full w-[15rem] flex-col border-neutral border-r bg-background shadow-xs">
            <nav class="overflow-y-auto p-4">
               <ul class="space-y-1">
                  <li>
                     <Link
                        to={"/"}
                        class={cx(
                           button({ variant: "ghost" }),
                           "flex w-full justify-start gap-2 px-2 font-medium text-foreground/70 leading-none transition-none hover:text-foreground aria-[current=page]:text-foreground",
                        )}
                     >
                        <strong class="-mt-0.5 text-lg">{"{ }"}</strong> JSON
                        format
                     </Link>
                  </li>
                  <li>
                     <Link
                        to={"/typescript"}
                        class={cx(
                           button({ variant: "ghost" }),
                           "flex w-full justify-start gap-2 px-2 font-medium text-foreground/70 leading-none transition-none hover:text-foreground aria-[current=page]:text-foreground",
                        )}
                     >
                        <strong class="-mt-0.5 text-sm">{"TS"}</strong> JSON to
                        typescript
                     </Link>
                  </li>
               </ul>
            </nav>
         </div>
      </aside>
   )
}
