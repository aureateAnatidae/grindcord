import { knexDb } from "@db/knexfile";
import type { SeasonRecord } from "@v1/season/models";
import type { Season, SeasonCreate, SeasonQuery } from "@v1/season/schemas";
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
    const { season_name, after, before } = season_query;
    const query = db<SeasonRecord>("Season").select("season_id");

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

/** Find the SeasonRecord with the matching `season_id`.
 * If no match is found, it returns null.
 */
export async function getSeason(
    season_id: number,
    db: Knex = knexDb,
): Promise<SeasonRecord | null> {
    return await db("Season")
        .first()
        .where({ season_id })
        .then((res) => res ?? null);
}

/** Given the definition for a Season, insert a SeasonRecord. */
export async function createSeason(
    season: SeasonCreate,
    db: Knex = knexDb,
): Promise<number> {
    return await db("Season")
        .insert({ ...season })
        .then((res) => res[0]);
}
