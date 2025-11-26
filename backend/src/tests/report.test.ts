import init_tables, { teardown } from "@db/init_tables";
import { test_knexDb } from "@db/tests/common";
import { afterEach, beforeAll, beforeEach, describe, test, vi } from "vitest";

test("/report", () => {
    beforeAll(async () => {
        await teardown(test_knexDb);
    });

    beforeEach(async () => {
        await init_tables(test_knexDb);
    });

    afterEach(async () => {
        await teardown(test_knexDb);
    });
});
