import { getUserPoints } from "@v1/guild/service";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

const UserPoints = z.object({ points: z.int() });

app.get(
    "/:guild_id/:user_id",
    describeRoute({
        description: "Get a user's points in a guild",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(UserPoints),
                    },
                },
            },
        },
    }),
    async (c) => {
        const { guild_id, user_id } = c.req.param();
        return c.json({ points: await getUserPoints(guild_id, user_id) });
    },
);
// Get a guild's leaderboard
// app.get("/:guild_id", c);

export default app;
