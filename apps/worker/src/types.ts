import type { ClientEnv, WorkerEnv } from "@vasyaqwe/infra/env"
import type { routes } from "."

type Variables = {
   env: WorkerEnv & ClientEnv
}

export type HonoEnv = {
   Bindings: WorkerEnv
   Variables: Variables
}

export type WorkerRoutes = typeof routes
