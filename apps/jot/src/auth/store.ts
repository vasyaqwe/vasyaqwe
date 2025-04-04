import { db } from "@/database"
import type { AuthState } from "@instantdb/core"
import { createEffect, createSignal, onCleanup } from "solid-js"

export function createAuth() {
   const [state, setState] = createSignal<AuthState>(
      db._reactor._currentUserCached,
   )

   createEffect(() => {
      const unsubscribe = db.subscribeAuth((auth) => {
         setState({
            isLoading: false,
            error: undefined,
            user: auth.user ?? null,
         })
      })

      onCleanup(() => {
         unsubscribe()
      })
   })

   return state
}
