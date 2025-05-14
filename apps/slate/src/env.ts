export const env = {
   ...import.meta.env,
   DATABASE_URL: `idb://${import.meta.env.DEV ? "slate-dev" : "slate"}`,
}
