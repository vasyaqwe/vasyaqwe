import m1 from "../../src-tauri/migrations/0000_natural_randall_flagg.sql?raw"

export const migrations = [
   {
      name: "init",
      sql: m1,
   },
]
