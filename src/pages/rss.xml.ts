import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
    const posts = await getCollection("blog");

    return rss({
        site: context.site!,
        title: "mudkip's blog",
        description: "welcome to my blog, i will occasionally post my thoughts and things i find interesting here.",
        items: posts
            .filter(post => post.data.published)
            .sort((left, right) => right.data.date.getTime() - left.data.date.getTime())
            .map(post => ({
                link: `/blog/${post.slug}`,
                title: post.data.title,
                description: post.data.description,
                pubDate: post.data.date,
                content: post.body,
            })),
        customData: "<language>en-us</language>",
        trailingSlash: false,
    })
}