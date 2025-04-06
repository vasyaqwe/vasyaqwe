import { clientEnv } from "@vasyaqwe/infra/env"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { ApiError } from "./error"
import { createRouter } from "./utils"

const app = createRouter()
   .use(logger())
   .use(async (c, next) => {
      c.set("env", { ...c.env, ...clientEnv[c.env.ENVIRONMENT] })
      await next()
   })
   .use((c, next) => {
      const handler = cors({
         origin: [c.var.env.JOT_URL],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(ApiError.handle)

const base = createRouter().get("/health", (c) =>
   c.json({
      message: "Healthy",
   }),
)

export const routes = app.route("/", base)

export default app
