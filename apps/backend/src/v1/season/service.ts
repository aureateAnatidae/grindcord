import { knexDb } from "@db/knexfile";
import type { SeasonRecord } from "@v1/season/models";
import type { SeasonQuery } from "@v1/season/schemas";
import type { Knex } from "knex";

/** Find the `season_id`s of Season records which match the parameters.
 * The arguments `after` and `before` do not refer to the entire span of a Season,
 * instead, it refers to a Season that is active for the full timespan between
 * `after` and `before`.
 */
export async function getSeasonIds(
    season_query: SeasonQuery,
    db: Knex = knexDb,
): Promise<Array<number>> {
    const { guild_id, season_name, after, before } = season_query;
    const query = db<SeasonRecord>("Season").select("season_id");
    if (guild_id) {
        query.where({ guild_id });
    }
    if (season_name) {
        // https://github.com/knex/knex/issues/5920
        query.whereLike("season_name", `%${season_name}%`);
    }
    if (after) {
        query.where("end_at", ">=", after);
    }
    if (before) {
        query.where("start_at", "<=", before);
    }
    return await query.then((res) => res.map((r) => r.season_id));
}
