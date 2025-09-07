import { clientEnv } from "@vasyaqwe/infra/env"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { ApiError } from "./error"
import { createRouter } from "./utils"
import { v, validator } from "./validator"

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

const base = createRouter()
   .get("/health", (c) =>
      c.json({
         message: "OK",
      }),
   )
   .post(
      "/generate-tag",
      validator(
         "json",
         v.object({ input: v.pipe(v.string(), v.minLength(1)) }),
      ),
      async (c) => {
         const json = c.req.valid("json")

         const messages = [
            { role: "system", content: "You are a helpful assistant" },
            {
               role: "user",
               content: `You are an AI that classifies short user input into one of the following tags: 
                  work, personal, to watch, shopping, chore, idea. If input starts with an uppercase letter, then it's probably something to watch.

                  Only return one tag.

                  Input: "${json.input}"`,
            },
         ]
         const response = await c.env.AI.run(
            // @ts-expect-error ...
            "@cf/meta/llama-3.1-8b-instruct-fast",
            { messages },
         )

         return c.json(response)
      },
   )

export const routes = app.route("/", base)

export default app
