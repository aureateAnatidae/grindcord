import { Season, SeasonId, SeasonQuery } from "@v1/season/schemas";
import { createSeason, getSeason, getSeasonIds } from "@v1/season/service";
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
                        schema: resolver(z.object({ season_ids: z.array(SeasonId) })),
                    },
                },
            },
        },
    }),
    validator("query", SeasonQuery),
    async (c) => {
        const season_query: SeasonQuery = c.req.valid("query");

        const season_ids: Array<number> = await getSeasonIds(season_query);
        return c.json({ season_ids });
    },
);

app.get(
    "/:season_id",
    describeRoute({
        description: "Get Season with a matching `season_id`",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(z.object({ season: Season })),
                    },
                },
            },
        },
    }),
    validator("param", SeasonId),
    async (c) => {
        const { season_id } = c.req.valid("param");
        const season: Season | null = await getSeason(season_id);
        return season ? c.json({ season }) : c.notFound();
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
                        schema: resolver(z.object({ season_id: SeasonId })),
                    },
                },
            },
        },
    }),
    validator("json", Season),
    async (c) => {
        const season: Season = c.req.valid("json");

        const season_id: number = await createSeason(season);
        return c.json({ season_id });
    },
);

export default app;
