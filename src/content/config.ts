import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
        date: z.string(),
    }),
});

export const collections = {
    blog: blogCollection,
}