import { knexDb } from "@db/knexfile";
import type { GuildSeasonRecord } from "@v1/guild/models";
import type { Knex } from "knex";

/** Get a Guild's currently assigned Season through a stored `GuildSeasonRecord`.
 * If the Guild does not have an assigned season, then return null.
 */
export async function getGuildSeason(
    guild_id: string,
    db: Knex = knexDb,
): Promise<GuildSeasonRecord | null> {
    return await db<GuildSeasonRecord>("GuildSeason")
        .first()
        .where({ guild_id })
        .then((res) => res ?? null);
}

/** Upsert a GuildSeason record.
 */
export async function upsertGuildSeason(
    guild_id: string,
    season_id: number,
    db: Knex = knexDb,
): Promise<GuildSeasonRecord> {
    return await db<GuildSeasonRecord>("GuildSeason")
        .upsert({ guild_id, season_id })
        .returning(["guild_id", "season_id"])
        .then((res) => res[0]);
}
