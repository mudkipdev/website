import { z, defineCollection } from "astro:content";
import { remark } from "remark";
import strip from "strip-markdown";

export const collections = {
    "blog": defineCollection({
        type: "content",
        schema: z.object({
            title: z.string(),
            date: z.date(),
            tags: z.array(z.string()).default([])
        })
    })
};

export async function stripContent(post: any): Promise<string> {
    let preview = String(await remark()
        .use(strip)
        .process(post.body));

    if (preview.length > 150) {
        preview = preview
            .substring(0, 150)
            .trim() + "...";
    }

    return preview;
}