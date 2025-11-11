import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      tanstackRouter({ target: "solid", autoCodeSplitting: true }),
      tailwindcss(),
      solidPlugin(),
      tsconfigPaths(),
   ],
   preview: {
      port: 3000,
   },
   server: {
      port: 3000,
   },
})
