import { BaseSeedSource as SSBUCharacterSeedSource } from "@db/CustomSeedSource";
import { init_tables, init_views } from "@db/init_tables";
import { knexDb } from "@db/knexfile";
import { serve } from "@hono/node-server";
import { honoLogger } from "@logtape/hono";
import { configure, getConsoleSink } from "@logtape/logtape";
import guild_router from "@v1/guild/router";
import match_router from "@v1/match/router";
import season_router from "@v1/season/router";
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

await init_tables();

await knexDb.seed.run();

await init_views();

app.use(requestId());
app.use(honoLogger());

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/match", match_router);
app.route("/season", season_router);
app.route("/guild", guild_router);
// app.route("/user", _router);

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
