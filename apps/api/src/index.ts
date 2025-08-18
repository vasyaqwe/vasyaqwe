// import app from "./app"

// const server = Bun.serve({
//    port: 8080,
//    hostname: "0.0.0.0",
//    fetch: app.fetch,
// })

// console.log("server running", server.port)

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
