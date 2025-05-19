import type { APIContext } from "astro";
import { getVariable } from "src/common";

const LASTFM_ENDPOINT = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={username}&api_key={apiKey}&format=json`;
const CACHE_EXPIRY = 1000 * 60 * 5;

let cachedMusicData: any = null;
let lastFetchTime = 0;

interface MusicData {
    track: string;
    artist: string;
    time: number | null;
}

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

async function fetchMusicData(apiKey: string, username: string): Promise<MusicData | null> {
    try {
        const endpoint = LASTFM_ENDPOINT
            .replace("{username}", username)
            .replace("{apiKey}", apiKey);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "User-Agent": "https://mudkip.dev",
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Last.fm data: ${response.statusText}`);
        }

        const data = await response.json();
        const trackData = data.recenttracks.track[0];

        if (!trackData) {
            console.error("No recent track found!");
            return null;
        }

        return {
            track: trackData.name,
            artist: trackData.artist["#text"],
            time: trackData.date ? trackData.date.uts : null
        };
    } catch (error) {
        console.error("Failed to fetch Last.fm data:", error);
        return null;
    }
}