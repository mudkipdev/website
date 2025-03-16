import { fetchCodingData } from "./data";

const CACHE_EXPIRY = 1000 * 60 * 5;
let cachedCodingData: any = null;
let lastFetchTime = 0;

export async function GET() {
    const currentTime = Date.now();

    if (cachedCodingData && (currentTime - lastFetchTime) < CACHE_EXPIRY) {
        return new Response(JSON.stringify(cachedCodingData), {
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const codingData = await fetchCodingData();
        cachedCodingData = codingData;
        lastFetchTime = currentTime;

        return new Response(JSON.stringify(codingData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
