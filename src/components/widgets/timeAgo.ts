export default function timeAgo(timestamp: number): string {
    let seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    const units = [
        { unit: "second", value: 60 },
        { unit: "minute", value: 60 },
        { unit: "hour", value: 24 },
        { unit: "day", value: 30 },
        { unit: "month", value: 12 },
        { unit: "year", value: Infinity }
    ];

    for (const { unit, value } of units) {
        if (seconds < value) {
            return `${seconds} ${unit}${seconds !== 1 ? "s" : ""} ago`;
        }

        seconds = Math.floor(seconds / value);
    }

    return `${seconds} years ago`;
}