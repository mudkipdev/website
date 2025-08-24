import type { APIContext } from "astro";
import { getVariable } from "src/common";

const OPEN_METEO_ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true&timezone=America/Denver&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch";
const CACHE_EXPIRY = 1000 * 60 * 5;

let cachedWeatherData: any = null;
let lastFetchTime = 0;

interface WeatherData {
    conditions: string;
    temperature: number;
}

function decipherWeatherCode(code: number): string {
    if (code == 0) return "clear";
    else if (code >= 1 && code <= 3) return "cloudy";
    else if (code == 45 || code == 48) return "foggy";
    else if ((code >= 51 && code <= 55) || code == 56 || code == 57) return "drizzling";
    else if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82) || code == 66 || code == 67) return "raining";
    else if ((code >= 71 && code <= 75) || code == 77 || code == 85 || code == 86) return "snowing";
    else if (code == 95 || code == 96 || code == 99) return "stormy";
    else return "unknown";
}

export async function GET(context: APIContext) {
    const latitude = getVariable(context, "LATITUDE");
    const longitude = getVariable(context, "LONGITUDE");
    const currentTime = Date.now();

    if (!latitude || !longitude) {
        return new Response(
            JSON.stringify({ error: "LATITUDE or LONGITUDE is missing!" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    if (cachedWeatherData && (currentTime - lastFetchTime) < CACHE_EXPIRY) {
        return new Response(JSON.stringify(cachedWeatherData), {
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const weatherData = await fetchWeatherData(latitude, longitude);
        cachedWeatherData = weatherData;
        lastFetchTime = currentTime;

        return new Response(JSON.stringify(weatherData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch data!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

async function fetchWeatherData(latitude: string, longitude: string): Promise<WeatherData | null> {
    try {
        const endpoint = OPEN_METEO_ENDPOINT
            .replace("{latitude}", latitude)
            .replace("{longitude}", longitude);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "User-Agent": "https://mudkip.dev",
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Open-Meteo data: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            conditions: decipherWeatherCode(data.current_weather.weathercode),
            temperature: data.current_weather.temperature
        };
    } catch (error) {
        console.error("Failed to fetch Open-Meteo data:", error);
        return null;
    }
}