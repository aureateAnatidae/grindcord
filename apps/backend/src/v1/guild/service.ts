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

/**
 * Insert a GuildSeason record.
 */
export async function insertGuildSeason(
    guild_id: string,
    season_id: number,
    db: Knex = knexDb,
): Promise<GuildSeasonRecord> {
    const guild_season_record: Array<GuildSeasonRecord> = await db<GuildSeasonRecord>(
        "GuildSeason",
    )
        .insert({ guild_id, season_id })
        .returning(["guild_id", "season_id"]);
    return guild_season_record[0];
}

/**
 * Update a GuildSeason record.
 */
export async function updateGuildSeason(
    guild_id: string,
    season_id: number,
    db: Knex = knexDb,
): Promise<number> {
    const affected_rows = await db<GuildSeasonRecord>(
        "GuildSeason",
    )
        .update({ season_id })
        .where({ guild_id });
    return affected_rows;
}
