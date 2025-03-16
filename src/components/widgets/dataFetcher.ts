import timeAgo from "./timeAgo";

async function fetchData() {
    try {
        const [codingResponse, musicResponse] = await Promise.all([
            fetch("/api/coding"),
            fetch("/api/music"),
        ]);

        const codingData = await codingResponse.json();
        const musicData = await musicResponse.json();

        return { codingData, musicData };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { codingData: null, musicData: null };
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const { codingData, musicData } = await fetchData();
    const codingElement = document.querySelector("#coding-data")!;
    const musicElement = document.querySelector("#music-data")!;

    if (codingData) {
        codingElement.innerHTML = `
            <p>
                <b>this week: </b>${codingData.weeklyTotal}
                <b>daily average: </b>${codingData.dailyAverage}
            </p>
        `;
    } else {
        codingElement.innerHTML = `<span class="error">Failed to fetch data!</span>`;
    }

    if (musicData) {
        musicElement.innerHTML = `
            <p>${musicData.artist} - ${musicData.track}</p>
            <p style="color: var(--surface-5)">${timeAgo(musicData.time)}</p>
        `;
    } else {
        musicElement.innerHTML = `<span class="error">Failed to fetch data!</span>`;
    }
});