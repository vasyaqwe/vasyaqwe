import app from "./app"

const server = Bun.serve({
   port: 8080,
   hostname: "0.0.0.0",
   fetch: app.fetch,
})

console.log("server running", server.port)
