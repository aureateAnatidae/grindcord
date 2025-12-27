import type { SeasonRecord } from "@v1/season/models";
import type { Knex } from "knex";
import type { SeasonQuery } from "./schemas";

/** Find the `season_id` of the current Seasons of a Guild with a `guild_id` */
export async function getSeasons(
    season_query: SeasonQuery,
    db: Knex,
): Promise<Array<SeasonRecord>> {
    const { season_id, guild_id, season_name, during } = season_query;
    const query = db<SeasonRecord>("Season").select();
    if (guild_id) {
        query.where({ guild_id });
    }
    if (season_id) {
        query.where({ season_id });
    }
    if (season_name) {
        query.whereILike(season_name, "%season_name%");
    }
    if (during) {
        query.where("end_at", "<=", during).where("start_at", "<=", during);
    }
    return await query;
}
