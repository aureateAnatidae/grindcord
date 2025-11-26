import { init_tables, teardown } from "@db/init_tables";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

await teardown();
await init_tables();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
