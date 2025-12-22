import { init_tables, init_views, teardown } from "@db/init_tables";
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
import { mock_MatchReport } from "@v1/match/test/mock.schemas";
import { MatchReportDerivedRow } from "@v1/match/views";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

// const _mockMatchReport = MatchReport.parse({
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
const mockMatchReport = mock_MatchReport();

describe("Match DB operations", () => {
    beforeEach(async () => {
        await init_tables(test_knexDb);
        await init_views(test_knexDb);
    });
    afterEach(async () => {
        await teardown(test_knexDb);
    });
    describe("Match record operations", () => {
        test("Insert a mock Match record", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);

            const created_match = await test_knexDb("Match")
                .first()
                .where({ match_id });
            expect(
                created_match.guild_id,
                "When retrieved, the Match record has the same data as is provided",
            ).toEqual(mockMatchReport.guild_id);
        });
    });

    describe("Inserting MatchPlayer records", () => {
        test("Insert a pair of mock MatchPlayer records", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);

            await createMatchPlayer(
                match_id,
                mockMatchReport.players[0].user_id,
                mockMatchReport.players[0].win_count,
                test_knexDb,
            );
            const created_match_player = await test_knexDb("MatchPlayer")
                .first()
                .where({ match_id });

            expect(
                created_match_player,
                "When retrieved, the MatchPlayer record has the same data as is provided",
            ).toEqual({
                match_id,
                user_id: mockMatchReport.players[0].user_id,
                win_count: mockMatchReport.players[0].win_count,
            });
        });
    });

    describe("Illegal insertions of MatchPlayer", () => {
        test.fails("Cannot insert MatchPlayer where [match_id, user_id] is not unique", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            for (let p_i = 0; p_i < 2; p_i++) {
                await createMatchPlayer(
                    match_id,
                    mockMatchReport.players[0].user_id,
                    mockMatchReport.players[0].win_count,
                    test_knexDb,
                );
            }
        });
        test.fails("Cannot insert MatchPlayer where there is no Match record with matching match_id", async () => {
            await createMatchPlayer(
                3000,
                mockMatchReport.players[0].user_id,
                mockMatchReport.players[0].win_count,
                test_knexDb,
            );
        });
    });

    describe("Inserting MatchCharacter records", () => {
        test("Insert a pair of mock MatchCharacter records", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);

            for (let p_i = 0; p_i < mockMatchReport.players.length; p_i++) {
                const { user_id, win_count, character } = mockMatchReport.players[p_i];
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

            const created_match_character_records = await test_knexDb("MatchCharacter")
                .select()
                .where({ match_id });
            const expected_match_characters = () => {
                const result = [];
                for (let p_i = 0; p_i < mockMatchReport.players.length; p_i++) {
                    const { user_id, character } = mockMatchReport.players[p_i];
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
            expect(
                created_match_character_records,
                "When retrieved, both MatchCharacter records have the same data as provided",
            ).toEqual(expect.arrayContaining(expected_match_characters()));
        });

        test.fails("Cannot insert MatchCharacter where [match_id, user_id, fighter_number] is not unique, specifically, `fighter_number`", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            for (let i = 0; i < 2; i++) {
                await createMatchCharacter(
                    match_id,
                    mockMatchReport.players[i].user_id,
                    mockMatchReport.players[1].character[0],
                    test_knexDb,
                );
            }
        });
        test.fails("Cannot insert MatchCharacter where a fighter_number is not in the SSBUCharTable", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            await createMatchCharacter(
                match_id,
                mockMatchReport.players[1].user_id,
                104,
                test_knexDb,
            );
        });
    });

    describe("Insert all records for an entire MatchReport (covers all insertion tests)", async () => {
        test("Report a match", async () => {
            const match_id = await reportMatch(mockMatchReport, test_knexDb);
            const { guild_id } = mockMatchReport;
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
            expect(mockMatchReport, "The records represent the MatchReport").toEqual({
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

    describe("Retrieve a full written MatchReport record", async () => {
        test("Retrieve a derived row from MatchReportView by match_id", async () => {
            const match_id = await reportMatch(mockMatchReport, test_knexDb);
            const { guild_id } = mockMatchReport;

            const match_query: MatchQuery = { match_id };
            const result = await getMatches(match_query, test_knexDb);
            const created_at = result[0].created_at;

            const expected = [];
            for (let p_i = 0; p_i < mockMatchReport.players.length; p_i++) {
                const { user_id, win_count, character } = mockMatchReport.players[p_i];
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
