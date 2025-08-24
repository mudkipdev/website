export default function toCelsius(temperature: number): number {
    return Math.round((temperature - 32) * 5 / 9);
}