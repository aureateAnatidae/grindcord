import { init_tables, teardown } from "@db/init_tables";
import { serve } from "@hono/node-server";
import set_router from "@v1/set/router";
import user_router from "@v1/user/router";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import {
  trimTrailingSlash,
} from 'hono/trailing-slash'


const app = new Hono();

await teardown();
await init_tables();


app.use(trimTrailingSlash())

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get(
    "/docs",
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
