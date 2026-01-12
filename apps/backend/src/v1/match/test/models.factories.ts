import { ssbu_character_names } from "@db/seeds/SSBUCharacters";
import { rand_character_array, randint, snowflake } from "@test/factories";
import type {
    MatchCharacterRecord,
    MatchPlayerRecord,
    MatchRecord,
} from "@v1/match/models";
import { SSBUCharEnumToFighterNumber } from "@v1/match/schemas";
import type { Knex } from "knex";

export const matchRecordFactory = (
    match_record: Partial<MatchRecord> | undefined = undefined,
): Omit<MatchRecord, "created_at"> => {
    return {
        match_id: randint(1000),
        guild_id: snowflake(),
        ...match_record,
    };
};

export const matchPlayerRecordFactory = (
    match_player_record: Partial<MatchPlayerRecord> | undefined = undefined,
): MatchPlayerRecord => {
    return {
        match_id: randint(1000),
        user_id: snowflake(),
        win_count: randint(50),
        ...match_player_record,
    };
};

export const matchCharacterRecordFactory = (
    match_character_record: Partial<MatchCharacterRecord> | undefined = undefined,
): MatchCharacterRecord => {
    return {
        match_id: randint(1000),
        user_id: snowflake(),
        fighter_number: randint(ssbu_character_names.length),
        ...match_character_record,
    };
};

/** TODO: Might not be necessary to insert so many random records without a way to test them.
 * Find a way to exploit all that coverage.
 * Generate MatchReport data that matches the database records so that we can check parity?
 */
export async function seed(knex: Knex) {
    // Ten total players, one hundred games between them in a single guild.
    const guild_id = snowflake();
    const user_id_list = Array.from({ length: 10 }, snowflake);

    // Generate all distinct pairs (i,j); i != j of users
    const possible_pairs = [];
    for (let i = 0; i < 10; i++) {
        for (let j = i + 1; j < 10; j++) {
            possible_pairs.push([i, j]);
        }
    }

    // Choose from these pairs at random, 40 times with replacement
    for (let _ = 0; _ < 40; _++) {
        const pair = possible_pairs[randint(possible_pairs.length)];

        const max_score = 1 + 2 * randint(25);
        const scores: Array<number> = ((w) => [w, randint(w)])(randint(max_score) + 1);

        const match_id = (await knex("Match").insert({ guild_id }))[0];
        // Randomize who gets inserted first
        // Randomize who gets the winning score
        const swap = randint(4);
        const swap_score = Math.floor(swap / 2);
        const swap_user_id = Number(swap % 2 === 0);
        await knex("MatchPlayer").insert({
            match_id,
            user_id: user_id_list[pair[swap_user_id]],
            win_count: scores[swap_score],
        });
        await knex("MatchPlayer").insert({
            match_id,
            user_id: user_id_list[pair[(swap_user_id + 1) % 2]],
            win_count: scores[(swap_score + 1) % 2],
        });

        for (let p_i = 0; p_i < pair.length; p_i++) {
            const characters = rand_character_array();
            for (let c_i = 0; c_i < characters.length; c_i++) {
                await knex("MatchCharacter").insert({
                    match_id,
                    user_id: user_id_list[pair[p_i]],
                    fighter_number: SSBUCharEnumToFighterNumber.decode(characters[c_i]),
                });
            }
        }
    }
}
