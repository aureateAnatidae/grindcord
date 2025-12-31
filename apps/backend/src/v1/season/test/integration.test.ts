import { init_tables, init_views, seed_db, teardown } from "@db/init_tables";
import { test_knexDb } from "@test/test_knexfile";
import type { SeasonRecord } from "@v1/season/models";
import { Season } from "@v1/season/schemas";
import { getSeasons } from "@v1/season/service";
import {
    currentSeasonRecordFactory,
    futureSeasonRecordFactory,
    pastSeasonRecordFactory,
} from "@v1/season/test/models.factories";
import type { Knex } from "knex";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

type TestSeedSourceProps = {
    season_records: Array<Omit<SeasonRecord, "season_id">>;
};
export class TestSeedSource {
    season_records: Array<Omit<SeasonRecord, "season_id">>;
    constructor({ season_records }: TestSeedSourceProps) {
        this.season_records = season_records;
    }

    getSeeds() {
        return Promise.resolve(this.season_records);
    }

    async getSeed(seed: Omit<SeasonRecord, "season_id">) {
        return {
            async seed(knex: Knex) {
                await knex("Season").insert(seed);
            },
        };
    }
}

beforeEach(async () => {
    await init_tables(test_knexDb);
    await init_views(test_knexDb);
});
afterEach(async () => {
    await teardown(test_knexDb);
});

describe("Season table operations", () => {
    let past_season: Omit<SeasonRecord, "season_id">;
    let current_season: Omit<SeasonRecord, "season_id">;
    let future_season: Omit<SeasonRecord, "season_id">;
    describe("Use `getSeasons`", () => {
        beforeEach(async () => {
            past_season = pastSeasonRecordFactory();
            current_season = currentSeasonRecordFactory();
            future_season = futureSeasonRecordFactory();
            await seed_db(
                new TestSeedSource({
                    season_records: [past_season, current_season, future_season],
                }),
                test_knexDb,
            );
        });
        test("Based on `after` and `before` arguments", async () => {
            const current_result = await getSeasons(
                { before: new Date().toISOString(), after: new Date().toISOString() },
                test_knexDb,
            );
            expect(current_result, "Returns only the ongoing Season").toHaveLength(1);
            expect(current_result[0]).toMatchObject(current_season);

            const reverse_result = await getSeasons(
                {
                    before: new Date(Date.now() - 1000).toISOString(),
                    after: new Date(Date.now() + 1000).toISOString(),
                },
                test_knexDb,
            );
            expect(reverse_result, "`after` > `before`").toHaveLength(1);
            expect(reverse_result[0]).toMatchObject(current_season);

            const current_future_result = await getSeasons(
                { after: new Date().toISOString() },
                test_knexDb,
            );
            expect(current_future_result, "Returns current and future").toHaveLength(2);
            expect(current_future_result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(current_season),
                    expect.objectContaining(future_season),
                ]),
            );

            const current_past_result = await getSeasons(
                { before: new Date().toISOString() },
                test_knexDb,
            );
            expect(current_past_result, "Returns current and past").toHaveLength(2);
            expect(current_past_result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(current_season),
                    expect.objectContaining(past_season),
                ]),
            );
        });
        test("Boundary", async () => {
            const before_at_start_result = await getSeasons(
                {
                    before: new Date(
                        new Date(current_season.start_at).getTime(),
                    ).toISOString(),
                },
                test_knexDb,
            );
            expect(
                before_at_start_result,
                "Set `before` to a Season's `start_at`",
            ).toHaveLength(2);
            expect(before_at_start_result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(current_season),
                    expect.objectContaining(past_season),
                ]),
            );
            const after_on_end_result = await getSeasons(
                {
                    after: new Date(
                        new Date(current_season.end_at).getTime(),
                    ).toISOString(),
                },
                test_knexDb,
            );
            expect(
                after_on_end_result,
                "Set `before` to a Season's `start_at`",
            ).toHaveLength(2);
            expect(after_on_end_result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(current_season),
                    expect.objectContaining(future_season),
                ]),
            );
        });
    });
});
