import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const blog = defineCollection({
   loader: glob({ base: "./src/blog", pattern: "**/*.{md,mdx}" }),
   schema: () =>
      z.object({
         title: z.string(),
         date: z.string(),
         draft: z.boolean(),
      }),
})

export const collections = { blog }
