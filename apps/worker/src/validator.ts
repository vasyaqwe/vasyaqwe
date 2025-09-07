export * as v from "valibot"

import type {
   Context,
   Env,
   Input,
   MiddlewareHandler,
   TypedResponse,
   ValidationTargets,
} from "hono"
import { validator as honoValidator } from "hono/validator"
import type {
   GenericSchema,
   GenericSchemaAsync,
   InferInput,
   InferOutput,
   SafeParseResult,
} from "valibot"
import { safeParseAsync } from "valibot"

export type Hook<
   T extends GenericSchema | GenericSchemaAsync,
   E extends Env,
   P extends string,
   Target extends keyof ValidationTargets = keyof ValidationTargets,
   // biome-ignore lint/complexity/noBannedTypes: <>
   O = {},
> = (
   result: SafeParseResult<T> & {
      target: Target
   },
   c: Context<E, P>,
) =>
   | Response
   | undefined
   | TypedResponse<O>
   | Promise<Response | undefined | TypedResponse<O>>

type HasUndefined<T> = undefined extends T ? true : false

export const validator = <
   T extends GenericSchema | GenericSchemaAsync,
   Target extends keyof ValidationTargets,
   E extends Env,
   P extends string,
   In = InferInput<T>,
   Out = InferOutput<T>,
   I extends Input = {
      in: HasUndefined<In> extends true
         ? {
              [K in Target]?: In extends ValidationTargets[K]
                 ? In
                 : { [K2 in keyof In]?: ValidationTargets[K][K2] }
           }
         : {
              [K in Target]: In extends ValidationTargets[K]
                 ? In
                 : { [K2 in keyof In]: ValidationTargets[K][K2] }
           }
      out: { [K in Target]: Out }
   },
   V extends I = I,
>(
   target: Target,
   schema: T,
   hook?: Hook<T, E, P, Target>,
): MiddlewareHandler<E, P, V> =>
   // @ts-expect-error not typed well
   honoValidator(target, async (value, c) => {
      const result = await safeParseAsync(schema, value)

      if (hook) {
         const hookResult = await hook({ ...result, target }, c)
         if (hookResult) {
            if (hookResult instanceof Response) {
               return hookResult
            }

            if ("response" in hookResult) {
               return hookResult.response
            }
         }
      }

      if (!result.success) {
         return c.json(result, 400)
      }

      return result.output
   })
