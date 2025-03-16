import { fetchMusicData } from "./data";

const CACHE_EXPIRY = 1000 * 60 * 5;
let cachedMusicData: any = null;
let lastFetchTime = 0;

export async function GET() {
    const currentTime = Date.now();

    if (cachedMusicData && (currentTime - lastFetchTime) < CACHE_EXPIRY) {
        return new Response(JSON.stringify(cachedMusicData), {
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const musicData = await fetchMusicData();
        cachedMusicData = musicData;
        lastFetchTime = currentTime;

        return new Response(JSON.stringify(musicData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
