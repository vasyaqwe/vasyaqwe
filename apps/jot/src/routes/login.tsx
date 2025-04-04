import { Button } from "@/ui/components/button"
import { createPresence } from "@solid-primitives/presence"
import { createFileRoute } from "@tanstack/solid-router"
import { Show, createSignal } from "solid-js"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
})

function RouteComponent() {
   const [email, setEmail] = createSignal("")
   const [step, setStep] = createSignal<"initial" | "code">("initial")

   const TRANSITION_MS = 350

   const initialPresence = createPresence(() => step() === "initial", {
      transitionDuration: TRANSITION_MS,
   })
   const codePresence = createPresence(() => step() === "code", {
      transitionDuration: TRANSITION_MS,
   })

   return (
      <div class="grid h-svh w-full place-items-center">
         <div class="w-full max-w-sm px-5">
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  if (step() === "initial") return setStep("code")
               }}
            >
               <div class="relative h-15">
                  <Show when={initialPresence.isMounted()}>
                     <div
                        class="absolute w-full"
                        style={{
                           transition: `all ${TRANSITION_MS}ms ease-out`,
                           opacity:
                              initialPresence.isEntering() ||
                              initialPresence.isExiting()
                                 ? 0
                                 : 1,
                           transform: initialPresence.isEntering()
                              ? "translateY(-1.5rem)"
                              : initialPresence.isExiting()
                                ? "translateY(-1.5rem)"
                                : "translateY(0)",
                           filter:
                              initialPresence.isEntering() ||
                              initialPresence.isExiting()
                                 ? "blur(0.25rem)"
                                 : "blur(0)",
                        }}
                     >
                        <h1 class="font-secondary text-foreground/75 text-lg">
                           Access Jot
                        </h1>
                        <label
                           for="email"
                           class="mt-1 inline-block w-fit font-semibold"
                        >
                           What is your email?
                        </label>
                     </div>
                  </Show>
                  <Show when={codePresence.isMounted()}>
                     <div
                        class="absolute w-full"
                        style={{
                           transition: `all ${TRANSITION_MS}ms ease-out`,
                           opacity:
                              codePresence.isEntering() ||
                              codePresence.isExiting()
                                 ? 0
                                 : 1,
                           transform:
                              codePresence.isEntering() ||
                              codePresence.isExiting()
                                 ? "translateY(1.5rem)"
                                 : "translateY(0)",
                           filter:
                              codePresence.isEntering() ||
                              codePresence.isExiting()
                                 ? "blur(0.25rem)"
                                 : "blur(0)",
                        }}
                     >
                        <h1 class="font-secondary text-foreground/75 text-lg">
                           Code sent
                        </h1>
                        <p class="mt-1 line-clamp-1 w-full font-semibold">
                           {email()}
                        </p>
                     </div>
                  </Show>
               </div>
               <div class="relative">
                  <Show when={step() === "initial"}>
                     <input
                        value={email()}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        name="email"
                        id="email"
                        type="email"
                        required
                        placeholder="example@mail.com"
                        class="h-12 w-full border-primary-5 border-b py-2 pr-22 transition-colors duration-100 placeholder:text-foreground/40 focus:border-primary-6 focus:outline-hidden md:h-10"
                     />
                  </Show>
                  <Show when={step() === "code"}>
                     <input
                        name="code"
                        id="code"
                        inputmode="numeric"
                        maxlength={4}
                        required
                        placeholder="0000"
                        class="h-12 w-full border-primary-5 border-b py-2 pr-22 text-lg transition-colors duration-100 placeholder:text-foreground/40 focus:border-primary-6 focus:outline-hidden md:h-10"
                     />
                  </Show>
                  <Button
                     variant={step() === "initial" ? "secondary" : "primary"}
                     class="absolute inset-y-0 right-0 bottom-0 my-auto w-[58px] md:bottom-0.5 md:w-[56px]"
                  >
                     {step() === "initial" ? "Login" : "Verify"}
                  </Button>
               </div>
               <Show when={codePresence.isMounted()}>
                  <div
                     class="absolute w-full"
                     style={{
                        transition: `all ${TRANSITION_MS}ms ease-out`,
                        opacity:
                           codePresence.isEntering() || codePresence.isExiting()
                              ? 0
                              : 1,
                        transform:
                           codePresence.isEntering() || codePresence.isExiting()
                              ? "translateY(0.25rem)"
                              : "translateY(0)",
                        filter:
                           codePresence.isEntering() || codePresence.isExiting()
                              ? "blur(0.25rem)"
                              : "blur(0)",
                     }}
                  >
                     <button
                        type="button"
                        onClick={() => setStep("initial")}
                        class="mt-3 cursor-pointer font-medium text-foreground/60 text-sm transition-colors duration-100 hover:text-foreground"
                     >
                        Go back
                     </button>
                  </div>
               </Show>
            </form>
         </div>
      </div>
   )
}
