## agent analytics
A simple middleware that you can add in your backend and capture the agent-traffic coming to your site. 

```js
import { Hono } from "hono";
import { track } from "track-agent";

const app = new Hono();

app.all("*", track()); // this captures the agent requests and store them in the database.

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

export default app;
```

**powered by hono, cloudflare workers and D1 database .**
