import { Hono } from "hono"
import { invoiceRouter } from "./invoice/router"

const app = new Hono()

app.get("/hello", (c) => {
   return c.json({
      message: "Hello from Hono!",
   })
})

app.route("/invoice", invoiceRouter)

export default app
