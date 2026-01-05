import { knexDb } from "@db/knexfile";
import type { SeasonRecord } from "@v1/season/models";
import type { Knex } from "knex";
import type { SeasonQuery } from "./schemas";

/** Find the `season_id` of the current Seasons of a Guild with a `guild_id`
 * The arguments `after` and `before` do not refer to the entire span of a Season,
 * instead, it refers to a Season that is active for the full timespan between
 * `after` and `before`.
 */
export async function getSeasons(
    season_query: SeasonQuery,
    db: Knex = knexDb,
): Promise<Array<SeasonRecord>> {
    const { season_id, guild_id, season_name, after, before } = season_query;
    const query = db<SeasonRecord>("Season").select();
    if (guild_id) {
        query.where({ guild_id });
    }
    if (season_id) {
        query.where({ season_id });
    }
    if (season_name) {
        query.whereILike("season_name", `%${season_name}%`);
    }
    if (after) {
        query.where("end_at", ">=", after);
    }
    if (before) {
        query.where("start_at", "<=", before);
    }
    return await query;
}
