import { init_tables, init_views, seed_db } from "@db/init_tables";
import { test_knexDb } from "@test/test_knexfile";
import type { MatchCharacterRecord } from "@v1/match/models";
import type { MatchQuery, MatchReport } from "@v1/match/schemas";
import {
    createMatch,
    createMatchCharacter,
    createMatchPlayer,
    getMatches,
    reportMatch,
} from "@v1/match/service";
import { seed as MatchFactorySeed } from "@v1/match/test/models.factories";
import { matchReportFactory } from "@v1/match/test/schemas.factories";
import { MatchReportDerivedRow } from "@v1/match/views";
import type { Knex } from "knex";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

// const _fakeMatchReport = MatchReport.parse({
//     guild_id: "19283746",
//     players: [
//         {
//             user_id: "12345678",
//             win_count: 5,
//             character: ["Mario"],
//         },
//         {
//             user_id: "87654321",
//             win_count: 2,
//             character: ["Kazuya", "Cloud"],
//         },
//     ],
// });
const fakeMatchReport = matchReportFactory();

export class TestSeedSource {
    getSeeds() {
        return Promise.resolve(["FakeMatches"]);
    }

    async getSeed(seed: string) {
        switch (seed) {
            case "FakeMatches":
                return {
                    async seed(knex: Knex) {
                        await MatchFactorySeed(knex);
                    },
                };
            default:
                throw new Error(`Invalid seed: "${seed}"`);
        }
    }
}

beforeEach(async () => {
    await init_tables(test_knexDb);
    await init_views(test_knexDb);

    await seed_db(new TestSeedSource(), test_knexDb);
});
afterEach(async () => {
    await test_knexDb.destroy();
    test_knexDb.initialize();
});

describe("Match table operations", () => {
    describe("Use `createMatch`", () => {
        describe("Random", () => {
            test("Insert a Match record with `createMatch`", async () => {
                const match_id = await createMatch(
                    fakeMatchReport.guild_id,
                    test_knexDb,
                );
                const created_match = await test_knexDb("Match")
                    .first()
                    .where({ match_id });
                expect(created_match.guild_id).toEqual(fakeMatchReport.guild_id);
                console.log(created_match);
            });
        });
    });
});

describe("MatchPlayer table operations", () => {
    describe("Use `createMatchPlayer`", () => {
        describe("Random", () => {
            test("Insert a pair of MatchPlayer records", async () => {
                const { guild_id } = fakeMatchReport;
                const match_id = (await test_knexDb("Match").insert({ guild_id }))[0];

                await createMatchPlayer(
                    match_id,
                    fakeMatchReport.players[0].user_id,
                    fakeMatchReport.players[0].win_count,
                    test_knexDb,
                );
                const created_match_player = await test_knexDb("MatchPlayer")
                    .first()
                    .where({ match_id });

                expect(created_match_player).toEqual({
                    match_id,
                    user_id: fakeMatchReport.players[0].user_id,
                    win_count: fakeMatchReport.players[0].win_count,
                });
            });
        });
        describe("Negative", () => {
            describe("Illegal insertions of MatchPlayer", () => {
                test.fails("Cannot insert MatchPlayer where [match_id, user_id] is not unique", async () => {
                    const { guild_id } = fakeMatchReport;
                    const match_id = (
                        await test_knexDb("Match").insert({ guild_id })
                    )[0];

                    for (let p_i = 0; p_i < 2; p_i++) {
                        await createMatchPlayer(
                            match_id,
                            fakeMatchReport.players[0].user_id,
                            fakeMatchReport.players[0].win_count,
                            test_knexDb,
                        );
                    }
                });
                test.fails("Cannot insert MatchPlayer where there is no Match record with matching match_id", async () => {
                    await createMatchPlayer(
                        3000,
                        fakeMatchReport.players[0].user_id,
                        fakeMatchReport.players[0].win_count,
                        test_knexDb,
                    );
                });
            });
        });
    });
});

describe("MatchCharacter table operations", () => {
    describe("Use `createMatchCharacter`", () => {
        describe("Random", () => {
            test("Insert a pair of MatchCharacter records", async () => {
                const { guild_id } = fakeMatchReport;
                const match_id = (await test_knexDb("Match").insert({ guild_id }))[0];

                for (let p_i = 0; p_i < fakeMatchReport.players.length; p_i++) {
                    const { user_id, win_count, character } =
                        fakeMatchReport.players[p_i];
                    await createMatchPlayer(match_id, user_id, win_count, test_knexDb);
                    for (let c_i = 0; c_i < character.length; c_i++) {
                        await createMatchCharacter(
                            match_id,
                            user_id,
                            character[c_i],
                            test_knexDb,
                        );
                    }
                }

                const created = await test_knexDb<MatchCharacterRecord>(
                    "MatchCharacter",
                )
                    .select()
                    .where({ match_id });
                const expected = (): Array<MatchCharacterRecord> => {
                    const result = [];
                    for (let p_i = 0; p_i < fakeMatchReport.players.length; p_i++) {
                        const { user_id, character } = fakeMatchReport.players[p_i];
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
                const { guild_id } = fakeMatchReport;
                const match_id = (await test_knexDb("Match").insert({ guild_id }))[0];

                for (let i = 0; i < 2; i++) {
                    await createMatchCharacter(
                        match_id,
                        fakeMatchReport.players[i].user_id,
                        fakeMatchReport.players[1].character[0],
                        test_knexDb,
                    );
                }
            });
            test.fails("Cannot insert MatchCharacter where a fighter_number is not in the SSBUCharTable", async () => {
                const { guild_id } = fakeMatchReport;
                const { user_id } = fakeMatchReport.players[1];

                const match_id = (await test_knexDb("Match").insert({ guild_id }))[0];
                await test_knexDb("MatchPlayer").insert({ match_id, user_id });
                await createMatchCharacter(match_id, user_id, 104, test_knexDb);
            });
        });
    });
});

describe("Operations across Match, MatchPlayer, and MatchCharacter tables", () => {
    describe("Use `reportMatch`", async () => {
        describe("Random", () => {
            test("Report a match", async () => {
                const { guild_id } = fakeMatchReport;

                const match_id = await reportMatch(fakeMatchReport, test_knexDb);

                const match_player_records = await test_knexDb("MatchPlayer")
                    .select()
                    .where({ match_id });
                const match_character_records = await test_knexDb("MatchCharacter")
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
                expect(fakeMatchReport).toEqual({
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
                const match_id = await reportMatch(fakeMatchReport, test_knexDb);
                const { guild_id } = fakeMatchReport;

                const match_query: MatchQuery = { match_id };
                const result = await getMatches(match_query, test_knexDb);
                const created_at = result[0].created_at;

                const expected = [];
                for (let p_i = 0; p_i < fakeMatchReport.players.length; p_i++) {
                    const { user_id, win_count, character } =
                        fakeMatchReport.players[p_i];
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
