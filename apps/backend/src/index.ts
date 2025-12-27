import { SeedSource as SSBUCharacterSeedSource } from "@db/BaseSeedSource";
import { init_tables, init_views, run_seed, teardown } from "@db/init_tables";
import { serve } from "@hono/node-server";
import { honoLogger } from "@logtape/hono";
import { configure, getConsoleSink } from "@logtape/logtape";
import match_router from "@v1/match/router";
import user_router from "@v1/user/router";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { openAPIRouteHandler } from "hono-openapi";

await configure({
    sinks: { console: getConsoleSink() },
    loggers: [
        { category: ["grindcord"], sinks: ["console"], lowestLevel: "trace" },
        { category: ["hono"], sinks: ["console"], lowestLevel: "info" },
    ],
});

const app = new Hono({ strict: false });

await teardown();
await init_tables();

await run_seed(new SSBUCharacterSeedSource());

await init_views();

app.use(requestId());
app.use(honoLogger());

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/match", match_router);
app.route("/user", user_router);

app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Grindcord REST API",
                version: "0.0.1",
                description: "Grindcord OpenAPI Reference",
            },
            servers: [{ url: "http://localhost:3000", description: "Local Server" }],
        },
    }),
);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
