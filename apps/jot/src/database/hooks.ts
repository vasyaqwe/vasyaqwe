import {
   type InstaQLLifecycleState,
   type InstaQLOptions,
   type InstaQLParams,
   type InstantCoreDatabase,
   type InstantSchemaDef,
   coerceQuery,
   weakHash,
} from "@instantdb/core"
import { createEffect, createSignal, onCleanup } from "solid-js"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function stateForResult(result: any) {
   return {
      isLoading: !result,
      data: undefined,
      pageInfo: undefined,
      error: undefined,
      ...(result ? result : {}),
   }
}

export function useQuery<
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
   const queryHash = weakHash(query)

   const [state, setState] = createSignal<InstaQLLifecycleState<Schema, Q>>(
      stateForResult(core._reactor?.getPreviousResult(query)),
   )

   createEffect(() => {
      const _currentQueryHash = queryHash

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

      // Clean up subscription when effect re-runs or component unmounts
      onCleanup(() => {
         unsubscribe()
      })
   })

   return state
}
