import { Season, SeasonQuery } from "@v1/season/schemas";
import { getSeasonIds } from "@v1/season/service";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

app.get(
    "/",
    describeRoute({
        description: "Find `season_id`s of Seasons which have the matching parameters",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(z.object({ matches: z.array(z.int()) })),
                    },
                },
            },
        },
    }),
    validator("query", SeasonQuery),
    async (c) => {
        const season_query: SeasonQuery = c.req.valid("query");

        const result = await getSeasonIds(season_query);
        return c.json(result);
    },
);

app.post(
    "/",
    describeRoute({
        description: "Create a new season",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(z.object({ season_id: z.int() })),
                    },
                },
            },
        },
    }),
    validator("json", Season),
    async (c) => {
        const season: Season = c.req.valid("json");

        const season_id = await createSeason(season);
        return c.json(season_id);
    },
);

export default app;
