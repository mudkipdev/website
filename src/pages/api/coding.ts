import type { APIContext } from "astro";
import { fetchCodingData } from "./dataFetcher";

const CACHE_EXPIRY = 1000 * 60 * 5;
let cachedCodingData: any = null;
let lastFetchTime = 0;

export async function GET(context: APIContext) {
    const apiKey = context.locals.runtime.WAKATIME_API_KEY || import.meta.env.WAKATIME_API_KEY;
    const currentTime = Date.now();

    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: "WAKATIME_API_KEY is missing!" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    if (cachedCodingData && (currentTime - lastFetchTime) < CACHE_EXPIRY) {
        return new Response(JSON.stringify(cachedCodingData), {
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const codingData = await fetchCodingData(apiKey);
        cachedCodingData = codingData;
        lastFetchTime = currentTime;

        return new Response(JSON.stringify(codingData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch data!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
