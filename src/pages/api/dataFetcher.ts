const WAKATIME_ENDPOINT = "https://wakatime.com/api/v1/users/current/stats/last_7_days";
const LASTFM_ENDPOINT = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={username}&api_key={apiKey}&format=json`;

interface CodingData {
    weeklyTotal: string;
    dailyAverage: string;
}

interface MusicData {
    track: string;
    artist: string;
    time: number | null;
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

export { fetchCodingData, fetchMusicData };