import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
   site: "https://vasyaqwe.com",
   integrations: [sitemap()],
   server: {
      port: 3000,
   },
})
