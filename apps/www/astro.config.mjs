import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
   site: "https://vasyldev.cc",
   integrations: [sitemap()],
   experimental: {
      svg: true,
   },
   server: {
      port: 3000,
   },
})
