// would like to rename this file to just "tests.ts"
import { init_tables, teardown } from "@db/init_tables";
import { test_knexDb } from "@tests/common";
import { type SetRecord, SetReport } from "@v1/set/schemas";

import { createSet, createSetReport } from "@v1/set/service";
import { beforeAll, beforeEach, describe, expect, expectTypeOf, test } from "vitest";

const mockSetReport = SetReport.parse({
    guild_id: "19283746",
    winner_id: "12345678",
    winner_tier: 3,
    winner_count: 5,
    winner_character: ["Link"],
    loser_id: "87654321",
    loser_tier: 3,
    loser_count: 2,
    loser_character: ["Kazuya", "Cloud"],
});

describe("Set DB operations", () => {
    beforeAll(async () => {
        await init_tables(test_knexDb);
    });

    beforeEach(async () => {
        await init_tables(test_knexDb);
    });

    describe("Inserting Set records", async () => {
        test("Insert a mock Set record", async () => {
            const set_id = await createSet(mockSetReport.guild_id, test_knexDb);
            expect(set_id).toStrictEqual([1]);
        });
    });

    describe("Verify the created Set record", () => {
        test("Only one Set record is created", async () => {
            const all_created_sets = await test_knexDb("Set").select();
            expect(all_created_sets.length).toBe(1);
        })
        test("When retrieved, the Set record is an instance of SetRecord", async () => {
            const created_set = await test_knexDb("Set").first();
            expectTypeOf(created_set).toEqualTypeOf<SetRecord>;
        });
        test("When retrieved, the Set record has the same data as is provided", async () => {
            const created_set = await test_knexDb("Set").first();
            expect(created_set.set_id).toBe(1);
            expect(created_set.guild_id).toBe(mockSetReport.guild_id);
        });
    });

    describe.todo("Inserting SetReport records");
    describe.todo("Verify the created SetReport records");

    describe.todo("Cannot insert SetResult where [set_id, user_id] is not unique");
    describe.todo("Cannot insert SetResult where there is no Set record with matching set_id");

    describe.todo("Inserting SetCharacter records");
    describe.todo("Verify the created SetCharacter records");

    describe.todo(
        "Cannot insert SetCharacter where [set_id, user_id, fighter_number] is not unique",
    );
    describe.todo("Cannot insert SetCharacter where a fighter_number is not in the SSBUCharTable");
});
