import { init_tables, init_views, seed_db, teardown } from "@db/init_tables";
import { test_knexDb } from "@test/test_knexfile";
import type { SeasonRecord } from "@v1/season/models";
import { Season } from "@v1/season/schemas";
import { getSeasons } from "@v1/season/service";
import {
    currentSeasonRecordFactory,
    futureSeasonRecordFactory,
    pastSeasonRecordFactory,
    seasonRecordFactory,
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

describe("Season table operations", () => {
    beforeEach(async () => {
        await init_tables(test_knexDb);
        await init_views(test_knexDb);
    });
    afterEach(async () => {
        await teardown(test_knexDb);
    });
    describe("Use `getSeasons`", () => {
        test("Typical", async () => {
            const past_season = pastSeasonRecordFactory();
            const current_season = currentSeasonRecordFactory();
            const future_season = futureSeasonRecordFactory();
            await seed_db(
                new TestSeedSource({
                    season_records: [past_season, current_season, future_season],
                }),
                test_knexDb,
            );

            const result = await getSeasons({ during: (new Date()).toISOString() }, test_knexDb);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject(current_season);

            // const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            // const created_match = await test_knexDb("Match")
            //     .first()
            //     .where({ match_id });
            // expect(
            //     created_match.guild_id,
            //     "When retrieved, the Match record has the same data as is provided",
            // ).toEqual(mockMatchReport.guild_id);
        });
    });
});
