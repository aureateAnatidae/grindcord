import type { MatchReport } from "@v1/match/schemas";
import { mock_MatchReport } from "@v1/match/test/mock.schemas";
import app from "@v1/match/router";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { describe, expect, test } from "vitest";

describe("A user may report a Match", () => {
    test("POST a mock MatchReport", async () => {
        const query: MatchReport = mock_MatchReport();
        const response = await app.request("/")
    });
});
