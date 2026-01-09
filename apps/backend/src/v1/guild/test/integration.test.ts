import { init_tables, init_views, seed_db, teardown } from "@db/init_tables";
import { test_knexDb } from "@test/test_knexfile";
import type { GuildSeasonRecord } from "@v1/guild/models";
import { getGuildSeason } from "@v1/guild/service";
import type { SeasonRecord } from "@v1/season/models";
import { currentSeasonRecordFactory } from "@v1/season/test/models.factories";
import { except } from "hono/combine";
import type { Knex } from "knex";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { guildSeasonRecordFactory } from "./models.factories";

export class TestSeedSource {
    seeds: Array<(knex: Knex) => Promise<void>>;
    constructor(seeds: Array<(knex: Knex) => Promise<void>>) {
        this.seeds = seeds;
    }

    getSeeds() {
        return Promise.resolve(this.seeds);
    }

    async getSeed(seed: (knex: Knex) => Promise<void>) {
        return {
            seed,
        };
    }
}

beforeEach(async () => {
    await init_tables(test_knexDb);
    await init_views(test_knexDb);
});
afterEach(async () => {
    await test_knexDb.destroy();
    test_knexDb.initialize();
});

describe("GuildSeason table operations", () => {
    describe("Use `getGuildSeason` to get a `GuildSeasonRecord`", () => {
        let season_record: Omit<SeasonRecord, "season_id">;
        let guild_season_record: GuildSeasonRecord;

        let season_id: number;
        let guild_id: string;
        beforeEach(async () => {
            season_record = currentSeasonRecordFactory();
            await seed_db(
                new TestSeedSource([
                    async (knex: Knex) => {
                        await knex("Season").insert(season_record);
                    },
                ]),
                test_knexDb,
            );

            season_id = await test_knexDb("Season")
                .first()
                .where(season_record)
                .then((res) => res.season_id);

            guild_season_record = guildSeasonRecordFactory({ season_id });
            guild_id = guild_season_record.guild_id;
            await seed_db(
                new TestSeedSource([
                    async (knex: Knex) => {
                        await knex("GuildSeason").insert(guild_season_record);
                    },
                ]),
                test_knexDb,
            );
        });
        test("Nominal", async () => {
            expect(
                await getGuildSeason(guild_id, test_knexDb).then(
                    (res) => res?.season_id,
                ),
            ).toBe(season_id);
        });
    });
});
