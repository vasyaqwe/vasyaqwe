import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import type { HonoEnv } from "../types"
import { v } from "../validator"

const ERROR_CODES = [
   "BAD_REQUEST",
   "FORBIDDEN",
   "INTERNAL_SERVER_ERROR",
   "USAGE_EXCEEDED",
   "DISABLED",
   "CONFLICT",
   "NOT_FOUND",
   "NOT_UNIQUE",
   "UNAUTHORIZED",
   "METHOD_NOT_ALLOWED",
   "UNPROCESSABLE_ENTITY",
   "TOO_MANY_REQUESTS",
] as const

export const codeSchema = v.object({
   code: v.picklist(ERROR_CODES),
})

export type Code = (typeof ERROR_CODES)[number]

export const statusToCode = (status: number): Code => {
   if (status === 400) return "BAD_REQUEST"
   if (status === 401) return "UNAUTHORIZED"
   if (status === 403) return "FORBIDDEN"
   if (status === 404) return "NOT_FOUND"
   if (status === 405) return "METHOD_NOT_ALLOWED"
   if (status === 409) return "CONFLICT"
   if (status === 422) return "UNPROCESSABLE_ENTITY"
   if (status === 429) return "TOO_MANY_REQUESTS"
   if (status === 500) return "INTERNAL_SERVER_ERROR"

   return "INTERNAL_SERVER_ERROR"
}

export const codeToStatus = (code: Code): number => {
   if (code === "BAD_REQUEST") return 400
   if (code === "UNAUTHORIZED") return 401
   if (code === "FORBIDDEN") return 403
   if (code === "NOT_FOUND") return 404
   if (code === "METHOD_NOT_ALLOWED") return 405
   if (code === "CONFLICT") return 409
   if (code === "UNPROCESSABLE_ENTITY") return 422
   if (code === "TOO_MANY_REQUESTS") return 429
   if (code === "INTERNAL_SERVER_ERROR") return 500

   return 500
}

export const parseValibotError = (error: unknown) => {
   if (!(error instanceof v.ValiError)) throw new Error("Invalid error")

   if (error.issues)
      return error.issues
         .map((issue) => {
            return `${issue.path.length ? `${issue.type} in '${issue.path}': ` : ""}${issue.message}`
         })
         .join("; ")

   return error.message ?? "Unknown error"
}

export const handle = (error: Error, c: Context<HonoEnv>) => {
   if (error instanceof v.ValiError) {
      const message = parseValibotError(error)
      console.error(400, message)
      return c.json(
         {
            code: statusToCode(400),
            message,
         },
         400,
      )
   }

   if (error instanceof HTTPException) {
      console.error(error.status, error.message)
      return c.json(
         {
            code: statusToCode(error.status),
            message: error.message,
         },
         error.status,
      )
   }

   const message = error.message ?? "Unknown error"
   console.error(500, message)
   return c.json(
      {
         code: statusToCode(500),
         message,
      },
      500,
   )
}
