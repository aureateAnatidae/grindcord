// would like to rename this file to just "tests.ts"
import { init_tables, init_views, teardown } from "@db/init_tables";
import { test_knexDb } from "@tests/test_knexfile";
import { type MatchRecord, MatchReport } from "@v1/match/schemas";

import { createMatch, createMatchPlayer } from "@v1/match/service";
import { beforeEach, describe, expect, expectTypeOf, test } from "vitest";

const mockMatchReport = MatchReport.parse({
    guild_id: "19283746",
    players: [
        {
            user_id: "12345678",
            win_count: 5,
            character: ["Link"],
        },
        {
            user_id: "87654321",
            win_count: 2,
            character: ["Kazuya", "Cloud"],
        },
    ],
});

describe("Match DB operations", () => {
    beforeEach(async () => {
        await teardown(test_knexDb);
        await init_tables(test_knexDb);
        await init_views(test_knexDb);
    });
    describe("Match record operations", () => {
        test("Insert a mock Match record", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            expectTypeOf(match_id, "A Match record is created").toEqualTypeOf<number>;

            const created_match = await test_knexDb("Match").first().where({ match_id });
            expectTypeOf(
                created_match,
                "When retrieved, a Match record is an instance of MatchRecord",
            ).toEqualTypeOf<MatchRecord>;
            expect(
                created_match.guild_id,
                "When retrieved, the Match record has the same data as is provided",
            ).toEqual(mockMatchReport.guild_id);
        });
    });

    describe("Inserting MatchPlayer records", () => {
        test("Insert a pair of mock MatchPlayer records", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            expectTypeOf(match_id, "A MatchPlayer record is created").toEqualTypeOf<number>;
            
            await createMatchPlayer(match_id, mockMatchReport.players[0], test_knexDb);
            const created_match_player = await test_knexDb("MatchPlayer").first().where({match_id})
            
            expectTypeOf(
                created_match_player,
                "When retrieved, a MatchPlayer record is an instance of MatchPlayerRecord",
            ).toEqualTypeOf<MatchRecordPlayer>;
            expect(
                created_match_player,
                "When retrieved, the MatchPlayer record has the same data as is provided",
            ).toEqual({
                match_id,
                user_id: mockMatchReport.players[0].user_id,
                win_count: mockMatchReport.players[0].win_count
            });
        });
    });

    describe("Illegal insertions of MatchPlayer", () => {
        test.fails("Cannot insert MatchResult where [match_id, user_id] is not unique", async () => {
            const match_id = await createMatch(mockMatchReport.guild_id, test_knexDb);
            await createMatchPlayer(match_id, mockMatchReport.players[0], test_knexDb);
            await createMatchPlayer(match_id, mockMatchReport.players[0], test_knexDb);
        })
    });
    describe.todo(
        "Cannot insert MatchResult where there is no Match record with matching match_id",
    );

    describe.todo("Inserting MatchCharacter records");
    describe.todo("Verify the created MatchCharacter records");

    describe.todo(
        "Cannot insert MatchCharacter where [match_id, user_id, fighter_number] is not unique",
    );
    describe.todo(
        "Cannot insert MatchCharacter where a fighter_number is not in the SSBUCharTable",
    );
});
