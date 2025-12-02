import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { MatchRecord, MatchReport } from "@v1/match/schemas";

const app = new Hono();

export default app;
