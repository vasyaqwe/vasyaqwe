export const clientEnv = {
   development: {
      API_URL: "http://localhost:8080",
      WORKER_URL: "http://localhost:8787",
      JOT_URL: "http://localhost:3000",
      CLOUDFLARE_ACCOUNT_ID: "bfef1e994f1aac7e7a42dc4ba75197a0",
   },
   production: {
      API_URL: "https://api.vasyaqwe.com",
      WORKER_URL: "https://worker.vasyaqwe.com",
      JOT_URL: "https://jot.vasyaqwe.com",
      CLOUDFLARE_ACCOUNT_ID: "bfef1e994f1aac7e7a42dc4ba75197a0",
   },
} as const

type Environment = "production" | "development"

export type WorkerEnv = {
   ENVIRONMENT: Environment
   AI: Ai
}

export type ClientEnv = (typeof clientEnv)[Environment]
