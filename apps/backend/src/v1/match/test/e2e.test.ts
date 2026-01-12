import { init_tables, init_views, teardown } from "@db/init_tables";
import { knexDb } from "@db/knexfile";
import app from "@v1/match/router";
import type { MatchReport } from "@v1/match/schemas";
import { matchReportFactory } from "@v1/match/test/schemas.factories";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("A user may report a Match", () => {
    beforeEach(async () => {
        await init_tables(knexDb);
        await init_views(knexDb);
    });
    afterEach(async () => {
        await teardown(knexDb);
    });
    test("POST a mock MatchReport", async () => {
        const query: MatchReport = matchReportFactory();
        // const response = await app.request("/");
    });
});
