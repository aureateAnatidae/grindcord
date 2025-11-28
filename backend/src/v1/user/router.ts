import { getUserPoints } from "@v1/user/service";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

app.get(
    "/:user_id",
    describeRoute({
        description: "Get a user's points in a guild",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: { points: z.number() },
                    },
                },
            },
        },
    }),
    (c) => {
        const user_id = c.req.param("user_id");
        return getUserPoints(user_id);
    },
);
// Get a guild's leaderboard
// app.get("/:guild_id", c);

export default app;
