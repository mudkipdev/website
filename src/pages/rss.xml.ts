import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
    const posts = await getCollection("blog");

    return rss({
        site: context.site!,
        title: "mudkip's blog",
        description: "Welcome to my blog! I will occasionally post my thoughts and things I find interesting here.",
        items: posts.map(post => ({
            link: `/blog/${post.slug}`,
            title: post.data.title,
            pubDate: post.data.date,
            content: post.body,
        })),
        customData: "<language>en-us</language>",
        trailingSlash: false,
    })
}