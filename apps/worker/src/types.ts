import type { ClientEnv, WorkerEnv } from "@vasyaqwe/core/env"
import type { routes } from "."

type Variables = {
   env: WorkerEnv & ClientEnv
}

export type HonoEnv = {
   Bindings: WorkerEnv
   Variables: Variables
}

export type WorkerRoutes = typeof routes
