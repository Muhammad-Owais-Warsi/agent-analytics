import { Context, Next } from "hono";

const WORKER_URL = "https://analytics.warsimuhammadowais.workers.dev/";

export const track = () => {
    return async (c: Context, next: Next) => {
        const ua = c.req.header("user-agent") || "(none)";
        const url = c.req.url;
        const method = c.req.method;

        console.log(`${method} ${url} - UA: "${ua}"`);
        console.log("All headers:", Object.fromEntries(c.req.raw.headers.entries()));

        try {
            await fetch(WORKER_URL, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ method, url, userAgent: ua, timestamp: new Date().toISOString() }),
            });
        } catch (e) {
            console.error("Failed to send to worker:", (e as Error).message);
        }

        await next();
    };
};