const WAKATIME_ENDPOINT = "https://wakatime.com/api/v1/users/current/stats/last_7_days";
const WAKATIME_API_KEY: string = import.meta.env.WAKATIME_API_KEY;
const LASTFM_API_KEY: string = import.meta.env.LASTFM_API_KEY;
const LASTFM_USERNAME: string = import.meta.env.LASTFM_USERNAME;
const LASTFM_ENDPOINT = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json`;

interface CodingData {
    weeklyTotal: string;
    dailyAverage: string;
}

interface MusicData {
    track: string;
    artist: string;
    time: number | null;
}

async function fetchCodingData(): Promise<CodingData | null> {
    if (!WAKATIME_API_KEY) {
        console.error("WAKATIME_API_KEY is missing");
        return null;
    }

    try {
        const response = await fetch(WAKATIME_ENDPOINT, {
            method: "GET",
            headers: {
                "User-Agent": "https://mudkip.dev",
                "Authorization": `Basic ${btoa(WAKATIME_API_KEY)}`,
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

async function fetchMusicData(): Promise<MusicData | null> {
    if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
        console.error("LASTFM_API_KEY or LASTFM_USERNAME is missing");
        return null;
    }

    try {
        const response = await fetch(LASTFM_ENDPOINT, {
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

export { fetchCodingData, fetchMusicData };