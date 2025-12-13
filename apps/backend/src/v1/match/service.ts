import { knexDb } from "@db/knexfile";
import type { MatchPlayer, MatchReport } from "@v1/match/schemas";
import type { Knex } from "knex";

/** Report a match.
 * Transactionally, create a record in the Match table, then create the matching pair
 * of records in MatchResult table, then the records for the MatchCharacter table.
 */
export async function reportMatchResult(
    match_report: MatchReport,
    db: Knex = knexDb,
): Promise<number> {
    const { guild_id, players } = match_report;
    const trx = await db.transaction();

    const match_id = await createMatch(guild_id, trx);

    for (let p_i = 0; p_i < players.length; p_i++) {
        const player = players[p_i];
        await createMatchPlayer(match_id, player.user_id, player.win_count, trx);

        for (let c_i = 0; c_i < player.character.length; c_i++) {
            const character = player.character[c_i];
            await createMatchCharacter(match_id, player.user_id, character, trx);
        }
    }
    trx.commit();
    return match_id;
}

/** Create a record in Match, returning the incrementing `match_id` of the new record.
 * @param {string} guild_id - The guild in which the match was recorded.
 */
export async function createMatch(
    guild_id: string,
    db: Knex = knexDb,
): Promise<number> {
    const match_id = await db("Match").insert({ guild_id });
    return match_id[0];
}

/** Create a record in MatchPlayer. */
export async function createMatchPlayer(
    match_id: number,
    user_id: string,
    win_count: number,
    db: Knex = knexDb,
): Promise<void> {
    await db("MatchPlayer").insert({ match_id, user_id, win_count });
    return;
}

/** Create a record in MatchCharacterTable. */
export async function createMatchCharacter(
    match_id: number,
    user_id: string,
    character: number,
    db: Knex = knexDb,
): Promise<void> {
    await db("MatchCharacter").insert({
        match_id,
        user_id,
        fighter_number: character,
    });

    return;
}

// Consider some sort of fighly flexible minimal abstraction over SQL so that developer/user can provide any bounds to search in table
// export async function getMatches(user_id: string): Promise<Array<MatchRecord>> {}
// export async function getMatchesNLast(
//     user_id: string,
//     n: number,
// ): Promise<Array<MatchRecord>> {}
// export async function getMatchesDateRange(
//     user_id: string,
//     start: string,
//     end: string,
// ): Promise<Array<MatchRecord>> {}
