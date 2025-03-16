import type { APIContext } from "astro";

export function getVariable(context: APIContext, name: string): string | null {
    return import.meta.env.DEV
        ? (import.meta.env[name] || null)
        : (context.locals.runtime.env[name] || null);
}