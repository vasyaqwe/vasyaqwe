import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      TanStackRouterVite({ target: "solid", autoCodeSplitting: true }),
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
