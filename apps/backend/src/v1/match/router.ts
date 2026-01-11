import { MatchQuery, MatchReport } from "@v1/match/schemas";
import { getMatches, reportMatch } from "@v1/match/service";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

app.get(
    "/",
    describeRoute({
        description: "Find recorded matches which have the matching parameters",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(z.object({ matches: z.array(MatchReport) })),
                    },
                },
            },
        },
    }),
    validator("query", MatchQuery),
    async (c) => {
        const match_query: MatchQuery = c.req.valid("query");

        const result = await getMatches(match_query);
        return c.json(result);
    },
);

app.post(
    "/",
    describeRoute({
        description: "Record a new match",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(z.object({ match_id: z.int() })),
                    },
                },
            },
        },
    }),
    validator("json", MatchReport),
    async (c) => {
        const match_report: MatchReport = c.req.valid("json");

        const result = await reportMatch(match_report);
        return c.json(result);
    },
);

export default app;
