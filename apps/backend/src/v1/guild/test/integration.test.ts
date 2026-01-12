import { InsertSeedSource } from "@db/CustomSeedSource";
import { init_tables, init_views } from "@db/init_tables";
import { knexDb } from "@db/knexfile";
import type { GuildSeasonRecord } from "@v1/guild/models";
import {
    getGuildSeason,
    insertGuildSeason,
    updateGuildSeason,
} from "@v1/guild/service";
import type { SeasonRecord } from "@v1/season/models";
import { currentSeasonRecordFactory } from "@v1/season/test/models.factories";
import type { Knex } from "knex";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { guildSeasonRecordFactory } from "./models.factories";

beforeEach(async () => {
    await init_tables(knexDb);
    await init_views(knexDb);
});
afterEach(async () => {
    await knexDb.destroy();
    knexDb.initialize();
});

describe("GuildSeason table operations", () => {
    describe("Use `getGuildSeason`", () => {
        let season_record: Omit<SeasonRecord, "season_id">;
        let guild_season_record: GuildSeasonRecord;

        let season_id: number;
        let guild_id: string;
        beforeEach(async () => {
            season_record = currentSeasonRecordFactory();
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({ Season: [season_record] }),
            });

            season_id = await knexDb("Season")
                .first()
                .where(season_record)
                .then((res) => res.season_id);

            guild_season_record = guildSeasonRecordFactory({ season_id });
            guild_id = guild_season_record.guild_id;
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({
                    GuildSeason: [guild_season_record],
                }),
            });
        });
        test("Nominal", async () => {
            expect(
                await getGuildSeason(guild_id, knexDb).then((res) => res?.season_id),
            ).toBe(season_id);
        });
    });
    describe("Use `insertGuildSeason`", () => {
        let season_record: Omit<SeasonRecord, "season_id">;
        let guild_season_record: GuildSeasonRecord;

        let season_id: number;
        beforeEach(async () => {
            season_record = currentSeasonRecordFactory();
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({ Season: [season_record] }),
            });

            season_id = await knexDb("Season")
                .first()
                .where(season_record)
                .then((res) => res.season_id);

            guild_season_record = guildSeasonRecordFactory({ season_id });
        });
        describe("Inserting a new `GuildSeason` record", () => {
            test("Nominal", async () => {
                const { guild_id } = guild_season_record;
                expect(
                    await insertGuildSeason(guild_id, season_id, knexDb),
                ).toMatchObject(guild_season_record);
                expect(
                    await knexDb("GuildSeason").first().where(guild_season_record),
                ).toMatchObject(guild_season_record);
            });
            test("Negative", async () => {
                const { guild_id } = guild_season_record;
                await knexDb("GuildSeason").insert(guild_season_record);
                await expect(
                    insertGuildSeason(guild_id, season_id, knexDb),
                    "A `Guild` cannot have more than one record",
                ).rejects.toThrowError("UNIQUE");
            });
        });
    });
    describe("Use `updateGuildSeason` to change the `season_id` of a `GuildSeason` record", () => {
        let old_season_record: Omit<SeasonRecord, "season_id">;
        let new_season_record: Omit<SeasonRecord, "season_id">;

        let guild_season_record: GuildSeasonRecord;

        let new_season_id: number;
        beforeEach(async () => {
            old_season_record = currentSeasonRecordFactory();
            new_season_record = currentSeasonRecordFactory();
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({
                    Season: [old_season_record, new_season_record],
                }),
            });
            const old_season_id = await await knexDb("Season")
                .first()
                .where(new_season_record)
                .then((res) => res.season_id);
            new_season_id = await knexDb("Season")
                .first()
                .where(new_season_record)
                .then((res) => res.season_id);

            guild_season_record = guildSeasonRecordFactory({
                season_id: old_season_id,
            });
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({
                    GuildSeason: [guild_season_record],
                }),
            });
        });
        describe("Updating an existing `GuildSeason` record", () => {
            test("Nominal", async () => {
                const { guild_id } = guild_season_record;
                expect(await updateGuildSeason(guild_id, new_season_id, knexDb)).toBe(
                    1,
                );
                expect(
                    await knexDb("GuildSeason").first().where({ guild_id }),
                ).toMatchObject({ guild_id, season_id: new_season_id });
            });
            test("Negative", async () => {
                expect(
                    await updateGuildSeason("thefarmer'sguild", new_season_id, knexDb),
                    "No rows affected when updating a `GuildSeason` that does not exist",
                ).toBe(0);
                await expect(
                    updateGuildSeason(guild_season_record.guild_id, 69420, knexDb),
                    "Cannot update a `GuildSeason` to a `season_id` that does not exist",
                ).rejects.toThrowError("FOREIGN");
            });
        });
    });
});
