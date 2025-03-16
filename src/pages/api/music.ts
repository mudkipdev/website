import type { APIContext } from "astro";
import { fetchMusicData } from "./dataFetcher";
import { getVariable } from "src/common";

const CACHE_EXPIRY = 1000 * 60 * 5;
let cachedMusicData: any = null;
let lastFetchTime = 0;

export async function GET(context: APIContext) {
    const apiKey = getVariable(context, "LASTFM_API_KEY");
    const username = getVariable(context, "LASTFM_USERNAME");
    const currentTime = Date.now();

    if (!apiKey || !username) {
        return new Response(
            JSON.stringify({ error: "LASTFM_API_KEY or LASTFM_USERNAME is missing!" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    if (cachedMusicData && (currentTime - lastFetchTime) < CACHE_EXPIRY) {
        return new Response(JSON.stringify(cachedMusicData), {
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const musicData = await fetchMusicData(apiKey, username);
        cachedMusicData = musicData;
        lastFetchTime = currentTime;

        return new Response(JSON.stringify(musicData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch data!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
