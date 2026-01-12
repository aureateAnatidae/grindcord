import { init_tables, init_views, teardown } from "@db/init_tables";
import { test_knexDb } from "@test/test_knexfile";
import app from "@v1/match/router";
import type { MatchReport } from "@v1/match/schemas";
import { matchReportFactory } from "@v1/match/test/schemas.factories";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

// TODO: Unsure how to write tests here.
// If e2e tests should not be a superset of tested functionality on integration tests, can we prevent total overlapping?
// How can we inject test_knexDb to the `service.ts` functions while only calling HTTP routes?
describe("A user may report a Match", () => {
    beforeEach(async () => {
        await init_tables(test_knexDb);
        await init_views(test_knexDb);
    });
    afterEach(async () => {
        await teardown(test_knexDb);
    });
    test("POST a mock MatchReport", async () => {
        const query: MatchReport = matchReportFactory();
        // const response = await app.request("/");
    });
});
