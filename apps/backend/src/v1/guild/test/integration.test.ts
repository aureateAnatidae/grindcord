import { init_tables, init_views, seed_db, teardown } from "@db/init_tables";
import { test_knexDb } from "@test/test_knexfile";
import type { GuildSeasonRecord } from "@v1/guild/models";
import type { Knex } from "knex";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

type TestSeedSourceProps = {
    guild_season_records: Array<Omit<GuildSeasonRecord, "season_id">>;
};

export class TestSeedSource {
    season_records: Array<Omit<GuildSeasonRecord, "season_id">>;
    constructor({ guild_season_records }: TestSeedSourceProps) {
        this.season_records = guild_season_records;
    }

    getSeeds() {
        return Promise.resolve(this.season_records);
    }

    async getSeed(seed: Omit<GuildSeasonRecord, "season_id">) {
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

describe("Season table operations", () => {});
