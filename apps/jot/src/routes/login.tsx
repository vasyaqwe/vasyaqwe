import { db } from "@/database"
import { Button } from "@/ui/components/button"
import type { SendMagicCodeResponse, VerifyResponse } from "@instantdb/core"
import { createFileRoute, useNavigate } from "@tanstack/solid-router"
import { formDataFromTarget, tryCatch } from "@vasyaqwe/ui/utils"
import { Show, createSignal } from "solid-js"
import { Transition } from "solid-transition-group"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
})

function RouteComponent() {
   const navigate = useNavigate()
   const [email, setEmail] = createSignal("")
   const [loading, setLoading] = createSignal(false)
   const [step, setStep] = createSignal<"initial" | "code">("initial")

   return (
      <div class="grid h-svh w-full place-items-center">
         <div class="w-full max-w-sm px-5">
            <form
               onSubmit={async (e) => {
                  e.preventDefault()
                  const form = formDataFromTarget<{
                     code: string
                  }>(e.target)
                  setLoading(true)

                  if (step() === "initial") {
                     const sentCode = await tryCatch<
                        SendMagicCodeResponse,
                        { body: { message: string } | undefined }
                     >(db.auth.sendMagicCode({ email: email() }))
                     setLoading(false)
                     if (sentCode.error) {
                        return alert(`Uh oh! ${sentCode.error.body?.message}`)
                     }
                     return setStep("code")
                  }

                  const verified = await tryCatch<
                     VerifyResponse,
                     { body: { message: string } | undefined }
                  >(
                     db.auth.signInWithMagicCode({
                        email: email(),
                        code: form.code,
                     }),
                  )

                  if (verified.error) {
                     setLoading(false)
                     return alert(`Uh oh! Code must be invalid.`)
                  }

                  navigate({ to: "/" }).then(() => navigate({ to: "/" }))
               }}
            >
               <div class="relative h-15">
                  <Transition
                     enterActiveClass="transition-all ease-out"
                     enterClass="opacity-0 -translate-y-13 blur-[3px]"
                     enterToClass="opacity-100 translate-y-0 blur-none"
                     exitActiveClass="transition-all ease-out"
                     exitClass="opacity-100 translate-y-0 blur-none"
                     exitToClass="opacity-0 -translate-y-13 blur-[3px]"
                  >
                     <Show when={step() === "initial"}>
                        <div class="absolute w-full duration-500">
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
                     <Transition
                        enterActiveClass="transition-all ease-out"
                        enterClass="opacity-0 translate-y-10 blur-[3px]"
                        enterToClass="opacity-100 translate-y-0 blur-none"
                        exitActiveClass="transition-all ease-out"
                        exitClass="opacity-100 translate-y-0 blur-none"
                        exitToClass="opacity-0 translate-y-10 blur-[3px]"
                     >
                        <Show when={step() === "code"}>
                           <div class="absolute w-full duration-500">
                              <h1 class="font-secondary text-foreground/75 text-lg">
                                 Code sent
                              </h1>
                              <p class="mt-1 line-clamp-1 w-full font-semibold">
                                 {email()}
                              </p>
                           </div>
                        </Show>
                     </Transition>
                  </Transition>
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
                        maxlength={6}
                        required
                        placeholder="000000"
                        autofocus
                        class="h-12 w-full border-primary-5 border-b py-2 pr-22 text-lg transition-colors duration-100 placeholder:text-foreground/40 focus:border-primary-6 focus:outline-hidden md:h-10"
                     />
                  </Show>
                  <Button
                     disabled={loading()}
                     variant={step() === "initial" ? "secondary" : "primary"}
                     class="absolute inset-y-0 right-0 bottom-0 my-auto w-[58px] md:bottom-0.5 md:w-[56px]"
                  >
                     {step() === "initial" ? "Login" : "Verify"}
                  </Button>
               </div>
               <Transition
                  enterActiveClass="transition-all ease-out"
                  enterClass="opacity-0 -translate-y-2 scale-[97%] blur-[3px]"
                  enterToClass="opacity-100 translate-y-0 blur-none"
                  exitActiveClass="transition-all ease-out"
                  exitClass="opacity-100 translate-y-0 blur-none"
                  exitToClass="opacity-0 -translate-y-2 scale-[97%] blur-[3px]"
               >
                  <Show when={step() === "code"}>
                     <div class="absolute w-fit duration-500">
                        <button
                           type="button"
                           onClick={() => setStep("initial")}
                           class="mt-3 cursor-pointer font-medium text-foreground/60 text-sm transition-colors duration-100 hover:text-foreground"
                        >
                           Go back
                        </button>
                     </div>
                  </Show>
               </Transition>
            </form>
         </div>
      </div>
   )
}
