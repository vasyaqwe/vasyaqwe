import { db } from "@/database"
import {
   type InstaQLLifecycleState,
   type InstaQLOptions,
   type InstaQLParams,
   type InstantCoreDatabase,
   type InstantSchemaDef,
   coerceQuery,
} from "@instantdb/core"
import { createEffect, createSignal, onCleanup } from "solid-js"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const stateForResult = (result: any) => {
   return {
      isLoading: !result,
      data: undefined,
      pageInfo: undefined,
      error: undefined,
      ...(result ? result : {}),
   }
}

function createQueryInternal<
   Q extends InstaQLParams<Schema>,
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   Schema extends InstantSchemaDef<any, any, any>,
>(
   core: InstantCoreDatabase<Schema>,
   initialQuery: null | Q,
   opts?: InstaQLOptions,
) {
   let queryToUse = initialQuery

   if (queryToUse && opts && "ruleParams" in opts) {
      queryToUse = { $$ruleParams: opts.ruleParams, ...queryToUse } as Q
   }

   const query = queryToUse ? coerceQuery(queryToUse) : null

   const [state, setState] = createSignal<InstaQLLifecycleState<Schema, Q>>(
      stateForResult(core._reactor?.getPreviousResult(query)),
   )

   createEffect(() => {
      if (!query) return

      const unsubscribe = core.subscribeQuery<Q>(query, (result) => {
         setState({
            isLoading: !result.data,
            // @ts-expect-error ...
            data: undefined,
            // @ts-expect-error ...
            pageInfo: undefined,
            ...result,
         })
      })

      onCleanup(() => {
         unsubscribe()
      })
   })

   return state
}

export function createQuery<
   Q extends InstaQLParams<Schema>,
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   Schema extends InstantSchemaDef<any, any, any>,
>(query: null | Q, opts?: InstaQLOptions) {
   return createQueryInternal(db, query, opts)
}
