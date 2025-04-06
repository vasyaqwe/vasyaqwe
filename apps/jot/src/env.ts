import { clientEnv } from "@vasyaqwe/infra/env"

export const env = {
   ...import.meta.env,
   ...clientEnv[import.meta.env.MODE as "development" | "production"],
}
