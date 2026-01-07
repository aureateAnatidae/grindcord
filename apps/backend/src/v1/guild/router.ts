import { SeasonId } from "@v1/season/schemas";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

app.get(
    "/season/:season_id",
    describeRoute({
        description: "Get the guild's currently active season",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        // schema: resolver(UserPoints),
                    },
                },
            },
        },
    }),
    validator("param", SeasonId),
    async (c) => {
        const { season_id } = c.req.valid("param");
        // return c.json({ points: await getUserPoints( user_id) });
    },
);
// Get a guild's leaderboard
// app.get("/:guild_id", c);

export default app;
