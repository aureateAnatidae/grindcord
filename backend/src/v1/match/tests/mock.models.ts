import { rand_character_array, randint, snowflake } from "@tests/mock";
import type { MatchPlayerRecord, MatchRecord } from "@v1/match/models";

export const mock_MatchRecord: Partial<MatchRecord> = (match_record: Partial<MatchRecord>) => {
    return {
        guild_id: snowflake(),
        ...match_record,
    };
};

export const mock_MatchPlayerRecord: MatchPlayerRecord = (
    match_player_record: Partial<MatchPlayerRecord>,
) => {
    return {
        match_id: randint(1000),
        user_id: snowflake(),
        win_count: randint(50),
        ...match_player_record,
    };
};

export const mock_MatchCharacterRecord: MatchCharacterRecord = (match_character_record) => {
    return {
        user_id: snowflake(),
        figther_number: randint(87),
        ...match_character_record,
    };
};

export async function seed(knex) {
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
            user_id: user_id_list[pair[swap_user_id + (1 % 2)]],
            win_count: scores[swap_score + (1 % 2)],
        });
    }
}
