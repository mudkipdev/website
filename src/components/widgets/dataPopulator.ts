import timeAgo from "./timeAgo";
import toCelsius from "./toCelsius";

const failedMessage = `<span class="error">failed to fetch data!</span>`;
const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
});

async function fetchData() {
    try {
        const [codingResponse, musicResponse, weatherResponse] = await Promise.all([
            fetch("/api/coding"),
            fetch("/api/music"),
            fetch("/api/weather")
        ]);

        const codingData = await codingResponse.json();
        const musicData = await musicResponse.json();
        const weatherData = await weatherResponse.json();

        return { codingData, musicData, weatherData };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { codingData: null, musicData: null, weatherData: null };
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const { codingData, musicData, weatherData } = await fetchData();
    const codingElement = document.querySelector("#coding-data")!;
    const musicElement = document.querySelector("#music-data")!;
    const weatherElement = document.querySelector("#weather-data")!;

    if (codingData != null && !("error" in codingData)) {
        codingElement.innerHTML = `
            <p>
                <b>this week: </b>${codingData.weeklyTotal}
                <br>
                <b>daily average: </b>${codingData.dailyAverage}
            </p>
        `;
    } else {
        codingElement.innerHTML = failedMessage;
    }

    if (musicData != null && !("error" in musicData)) {
        const style = musicData.time == null
            ? "color: var(--surface-5); animation: blink 1.5s infinite"
            : "color: var(--surface-5)";

        musicElement.innerHTML = `
            <p>${musicData.artist} - ${musicData.track}</p>
            <p style="${style}">${musicData.time ? timeAgo(musicData.time) : "now playing"}</p>`;
    } else {
        musicElement.innerHTML = failedMessage;
    }

    if (weatherData != null && !("error" in weatherData)) {
        weatherElement.innerHTML = `
            <p><b>temperature:</b> ${Math.round(weatherData.temperature)}°F (${toCelsius(weatherData.temperature)}°C)
            <p style="color: var(--surface-5)">${formatter.format(new Date())} - ${weatherData.conditions}</p>`;
    } else {
        weatherElement.innerHTML = failedMessage;
    }
});