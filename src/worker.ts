import { Hono } from "hono";
import type { Context } from "hono";

type Bindings = {
    agent_analytics: D1Database;
};
export type AppContext = Context<{ Bindings: Bindings }>;

const app = new Hono<{ Bindings: Bindings }>();

app.get("/logs", async (c) => {
    const { results } = await c.env.agent_analytics
        .prepare("SELECT * FROM request_logs ORDER BY id DESC LIMIT 20")
        .all();
    return c.json(results);
});

app.post("/", async (c) => {
    const body = await c.req.json<{
        method: string;
        url: string;
        userAgent: string;
        timestamp: string;
    }>();

    console.log(body);

    try {
        const result = await c.env.agent_analytics
            .prepare(
                `
            INSERT INTO request_logs (timestamp, method, url, user_agent)
            VALUES (?, ?, ?, ?)
        `,
            )
            .bind(body.timestamp, body.method, body.url, body.userAgent)
            .run();
        console.log("D1 result:", result);
        return c.json({ ok: true, result });
    } catch (e) {
        console.error("D1 insert failed:", e);
        return c.json({ ok: false, error: String(e) }, 500);
    }
});

export default app;
