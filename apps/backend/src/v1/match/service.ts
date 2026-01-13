import { knexDb } from "@db/knexfile";
import { getGuildSeason } from "@v1/guild/service";
import type {
    MatchCharacterRecord,
    MatchPlayerRecord,
    MatchRecord,
} from "@v1/match/models";
import type { MatchQuery, MatchReport } from "@v1/match/schemas";
import type { MatchReportDerivedRow } from "@v1/match/views";
import type { Knex } from "knex";

/** Report a match.
 * Transactionally, create a record in the Match table, then create the matching pair
 * of records in MatchResult table, then the records for the MatchCharacter table.
 */
export async function reportMatch(
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
            const fighter_number = player.character[c_i];
            await createMatchCharacter(match_id, player.user_id, fighter_number, trx);
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
    const guild_season_record = await getGuildSeason(guild_id, db);
    if (!guild_season_record) {
        throw Error("The guild is not registered in a season.");
    }
    const match_id = await db<MatchRecord>("Match").insert({
        guild_id,
        season_id: guild_season_record.season_id,
    });
    return match_id[0];
}

/** Create a record in MatchPlayer. */
export async function createMatchPlayer(
    match_id: number,
    user_id: string,
    win_count: number,
    db: Knex = knexDb,
): Promise<void> {
    await db<MatchPlayerRecord>("MatchPlayer").insert({ match_id, user_id, win_count });
    return;
}

/** Create a record in MatchCharacterTable. */
export async function createMatchCharacter(
    match_id: number,
    user_id: string,
    fighter_number: number,
    db: Knex = knexDb,
): Promise<void> {
    await db<MatchCharacterRecord>("MatchCharacter").insert({
        match_id,
        user_id,
        fighter_number,
    });
    return;
}

/** Return joined match data matching the parameters in the `match_query` */
export async function getMatches(
    match_query: MatchQuery,
    db: Knex = knexDb,
): Promise<Array<MatchReportDerivedRow>> {
    const match_reports = await db<MatchReportDerivedRow>("MatchReportView")
        .select()
        .where({ ...match_query });
    return match_reports;
}
