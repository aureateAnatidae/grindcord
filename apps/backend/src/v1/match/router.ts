import { MatchQuery, MatchReport } from "@v1/match/schemas";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";
import { getMatches, reportMatch } from "./service";

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
                        schema: resolver(z.object({ sets: z.array(MatchReport) })),
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
                        schema: resolver(z.object({ set_id: z.int() })),
                    },
                },
            },
        },
    }),
    validator("json", MatchReport),
    async (c) => {
        const match_report: MatchReport = c.req.valid("json")
        
        const result = await reportMatch(match_report);
        return c.json(result)
    }
);

export default app;
