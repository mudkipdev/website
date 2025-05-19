import type { APIContext } from "astro";
import { getVariable } from "src/common";

const WAKATIME_ENDPOINT = "https://wakatime.com/api/v1/users/current/stats/last_7_days";
const CACHE_EXPIRY = 1000 * 60 * 5;

let cachedCodingData: any = null;
let lastFetchTime = 0;

interface CodingData {
    weeklyTotal: string;
    dailyAverage: string;
}

export async function GET(context: APIContext) {
    const apiKey = getVariable(context, "WAKATIME_API_KEY");
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

async function fetchCodingData(apiKey: string): Promise<CodingData | null> {
    try {
        const response = await fetch(WAKATIME_ENDPOINT, {
            method: "GET",
            headers: {
                "User-Agent": "https://mudkip.dev",
                "Authorization": `Basic ${btoa(apiKey)}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Wakatime data: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            weeklyTotal: data.data.human_readable_total,
            dailyAverage: data.data.human_readable_daily_average
        };
    } catch (error) {
        console.error("Failed to fetch Wakatime data:", error);
        return null;
    }
}