// @ts-check
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
   site: "https://vasyaqwe.com",
   integrations: [sitemap()],
   markdown: { shikiConfig: { theme: "github-light" } },
   server: { port: 3000 },
   vite: { plugins: [tailwindcss()] },
})
