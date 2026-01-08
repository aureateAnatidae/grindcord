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
