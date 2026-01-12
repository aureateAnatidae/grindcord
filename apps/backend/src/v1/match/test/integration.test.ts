import { InsertSeedSource } from "@db/CustomSeedSource";
import { init_tables, init_views } from "@db/init_tables";
import { knexDb } from "@db/knexfile";
import type {
    MatchCharacterRecord,
    MatchPlayerRecord,
    MatchRecord,
} from "@v1/match/models";
import {
    MatchPlayer,
    type MatchQuery,
    type MatchReport,
    type SSBUCharFighterNumber,
} from "@v1/match/schemas";
import {
    createMatch,
    createMatchCharacter,
    createMatchPlayer,
    getMatches,
    reportMatch,
} from "@v1/match/service";
import { matchReportFactory } from "@v1/match/test/schemas.factories";
import { MatchReportDerivedRow } from "@v1/match/views";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { matchPlayerRecordFactory, matchRecordFactory } from "./models.factories";

// Nominal fake data that is not inserted should be defined here
const nominal_match_report = matchReportFactory({
    guild_id: "123456789",
    players: [
        MatchPlayer.parse({
            user_id: "12345678",
            win_count: 5,
            character: ["Mario"],
        }),
        MatchPlayer.parse({
            user_id: "87654321",
            win_count: 2,
            character: ["Kazuya", "Cloud"],
        }),
    ],
});

beforeEach(async () => {
    await init_tables(knexDb);
    await init_views(knexDb);
});
afterEach(async () => {
    await knexDb.destroy();
    knexDb.initialize();
});

describe("Match table operations", () => {
    describe("Use `createMatch`", () => {
        describe("Nominal", () => {
            test("Insert a Match record with `createMatch`", async () => {
                const match_id = await createMatch(
                    nominal_match_report.guild_id,
                    knexDb,
                );
                const created_match = await knexDb<MatchRecord>("Match")
                    .first()
                    .where({ match_id });
                expect(created_match?.guild_id).toEqual(nominal_match_report.guild_id);
                console.log(created_match);
            });
        });
    });
});

describe("MatchPlayer table operations", () => {
    describe("Use `createMatchPlayer`", () => {
        let match_record: Omit<MatchRecord, "match_id" | "created_at">;
        let match_id: number;
        beforeEach(async () => {
            match_record = matchRecordFactory({ guild_id: "123456789" });
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({ Match: [match_record] }),
            });

            match_id = await knexDb("Match")
                .first()
                .where(match_record)
                .then((res) => res.match_id);
        });
        describe("Nominal", () => {
            test("Insert a pair of MatchPlayer records", async () => {
                await createMatchPlayer(
                    match_id,
                    nominal_match_report.players[0].user_id,
                    nominal_match_report.players[0].win_count,
                    knexDb,
                );
                const created_match_player = await knexDb("MatchPlayer")
                    .first()
                    .where({ match_id });

                expect(created_match_player).toMatchObject({
                    match_id,
                    user_id: nominal_match_report.players[0].user_id,
                    win_count: nominal_match_report.players[0].win_count,
                });
            });
        });
        describe("Negative", () => {
            describe("Illegal insertions of MatchPlayer", () => {
                test.fails("Cannot insert MatchPlayer where [match_id, user_id] is not unique", async () => {
                    for (let p_i = 0; p_i < 2; p_i++) {
                        await createMatchPlayer(
                            match_id,
                            nominal_match_report.players[0].user_id,
                            nominal_match_report.players[0].win_count,
                            knexDb,
                        );
                    }
                });
                test.fails("Cannot insert MatchPlayer where there is no Match record with matching match_id", async () => {
                    await createMatchPlayer(
                        3000,
                        nominal_match_report.players[0].user_id,
                        nominal_match_report.players[0].win_count,
                        knexDb,
                    );
                });
            });
        });
    });
});

describe("MatchCharacter table operations", () => {
    describe("Use `createMatchCharacter`", () => {
        let match_record: Omit<MatchRecord, "match_id" | "created_at">;
        let match_player_record_1: MatchPlayerRecord;
        let match_player_record_2: MatchPlayerRecord;
        let match_id: number;
        let match_player_id_1: string;
        let match_player_id_2: string;

        let match_player_characters_1: Array<SSBUCharFighterNumber>;
        let match_player_characters_2: Array<SSBUCharFighterNumber>;
        beforeEach(async () => {
            match_record = matchRecordFactory({
                guild_id: nominal_match_report.guild_id,
            });
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({
                    Match: [match_record],
                }),
            });

            match_id = await knexDb("Match")
                .first()
                .where(match_record)
                .then((res) => res.match_id);
            match_player_record_1 = matchPlayerRecordFactory({
                match_id,
                user_id: nominal_match_report.players[0].user_id,
                win_count: nominal_match_report.players[0].win_count,
            });
            match_player_record_2 = matchPlayerRecordFactory({
                match_id,
                user_id: nominal_match_report.players[1].user_id,
                win_count: nominal_match_report.players[1].win_count,
            });
            await knexDb.seed.run({
                seedSource: new InsertSeedSource({
                    MatchPlayer: [match_player_record_1, match_player_record_2],
                }),
            });

            match_player_id_1 = match_player_record_1.user_id;
            match_player_id_2 = match_player_record_2.user_id;

            match_player_characters_1 = nominal_match_report.players[0].character;
            match_player_characters_2 = nominal_match_report.players[1].character;
        });
        describe("Nominal", () => {
            test("Insert a pair of MatchCharacter records", async () => {
                for (let c_i = 0; c_i < match_player_characters_1.length; c_i++) {
                    await createMatchCharacter(
                        match_id,
                        match_player_id_1,
                        match_player_characters_1[c_i],
                        knexDb,
                    );
                }
                for (let c_i = 0; c_i < match_player_characters_2.length; c_i++) {
                    await createMatchCharacter(
                        match_id,
                        match_player_id_2,
                        match_player_characters_2[c_i],
                        knexDb,
                    );
                }

                const created = await knexDb<MatchCharacterRecord>("MatchCharacter")
                    .select()
                    .where({ match_id });
                const expected = (): Array<MatchCharacterRecord> => {
                    const result = [];
                    for (let p_i = 0; p_i < 2; p_i++) {
                        const { user_id, character } =
                            nominal_match_report.players[p_i];
                        for (let c_i = 0; c_i < character.length; c_i++) {
                            const fighter_number = character[c_i];
                            result.push({
                                match_id,
                                user_id,
                                fighter_number,
                            });
                        }
                    }
                    return result;
                };
                expect(created).toEqual(expect.arrayContaining(expected()));
            });
        });

        describe("Negative", () => {
            test.fails("Cannot insert MatchCharacter where [match_id, user_id, fighter_number] is not unique, specifically, `fighter_number`", async () => {
                for (let i = 0; i < 2; i++) {
                    await createMatchCharacter(
                        match_id,
                        nominal_match_report.players[0].user_id,
                        nominal_match_report.players[1].character[0],
                        knexDb,
                    );
                }
            });
            test.fails("Cannot insert MatchCharacter where a fighter_number is not in the SSBUCharTable", async () => {
                const { user_id } = nominal_match_report.players[1];

                await createMatchCharacter(match_id, user_id, 404, knexDb);
            });
        });
    });
});

describe("Operations across Match, MatchPlayer, and MatchCharacter tables", () => {
    describe("Use `reportMatch`", async () => {
        describe("Random", () => {
            test("Report a match", async () => {
                const { guild_id } = nominal_match_report;

                const match_id = await reportMatch(nominal_match_report, knexDb);

                const match_player_records = await knexDb("MatchPlayer")
                    .select()
                    .where({ match_id });
                const match_character_records = await knexDb("MatchCharacter")
                    .select()
                    .where({ match_id });
                const expected: MatchReport = {
                    guild_id,
                    players: match_player_records.map(({ user_id, win_count }) => ({
                        user_id,
                        win_count,
                        character: match_character_records
                            .filter(
                                (character_record: MatchCharacterRecord) =>
                                    character_record.user_id === user_id,
                            )
                            .map(
                                (character_record: MatchCharacterRecord) =>
                                    character_record.fighter_number,
                            ),
                    })),
                };
                expect(nominal_match_report).toEqual({
                    ...expected,
                    players: expect.arrayContaining(
                        expected.players.map((player) => ({
                            ...player,
                            character: expect.arrayContaining(player.character),
                        })),
                    ),
                });
            });
        });
    });

    describe("Use `getMatches`", async () => {
        describe("Random", () => {
            test("Retrieve a derived row from MatchReportView by match_id", async () => {
                const match_id = await reportMatch(nominal_match_report, knexDb);
                const { guild_id } = nominal_match_report;

                const match_query: MatchQuery = { match_id };
                const result = await getMatches(match_query, knexDb);
                const created_at = result[0].created_at;

                const expected = [];
                for (let p_i = 0; p_i < nominal_match_report.players.length; p_i++) {
                    const { user_id, win_count, character } =
                        nominal_match_report.players[p_i];
                    for (let c_i = 0; c_i < character.length; c_i++) {
                        const fighter_number = character[c_i];
                        expected.push(
                            MatchReportDerivedRow.parse({
                                match_id,
                                guild_id,
                                user_id,
                                win_count,
                                fighter_number,
                                created_at,
                            }),
                        );
                    }
                }
                expect(result).toEqual(expect.arrayContaining(expected));
            });
        });
    });
});
