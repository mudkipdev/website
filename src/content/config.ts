import { z, defineCollection } from "astro:content";

export const collections = {
    "blog": defineCollection({
        type: "content",
        schema: z.object({
            title: z.string(),
            description: z.string(),
            date: z.date(),
            tags: z.array(z.string()).default([])
        })
    })
};