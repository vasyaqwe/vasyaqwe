import type { ComponentProps } from "solid-js"
import { Toaster as Sonner } from "solid-sonner"

export function Toaster(props: ComponentProps<typeof Sonner>) {
   return (
      <Sonner
         icons={{
            // loading: <Loading />,
            success: (
               <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  class="text-green-600"
               >
                  <circle
                     cx="7"
                     cy="7"
                     r="6"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2"
                     stroke-dasharray="3.14 0"
                     stroke-dashoffset="-0.7"
                  />
                  <circle
                     cx="7"
                     cy="7"
                     r="3"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="6"
                     stroke-dasharray="18.84955592153876 100"
                     stroke-dashoffset="0"
                     transform="rotate(-90 7 7)"
                  />
                  <path
                     stroke="none"
                     fill="white"
                     d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
                  />
               </svg>
            ),
            error: (
               <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-red-700"
               >
                  <circle
                     cx="10"
                     cy="10"
                     r="10"
                     fill="currentColor"
                  />
                  <path
                     d="M14 6L6 14"
                     stroke="white"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                  />
                  <path
                     d="M6 6L14 14"
                     stroke="white"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                  />
               </svg>
            ),
            info: (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-5"
               >
                  <path
                     fill-rule="evenodd"
                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                     clip-rule="evenodd"
                  />
               </svg>
            ),
         }}
         toastOptions={{
            unstyled: true,
            class: "font-primary px-4 py-3 items-center gap-2 w-full shadow-lg flex select-none border border-primary-2 bg-primary-1 text-base pointer-events-auto rounded-lg",
         }}
         position="bottom-right"
         {...props}
      />
   )
}
