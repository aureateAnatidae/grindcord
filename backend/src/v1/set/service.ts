import { knexDb } from "@db/knexfile";
import type { SetReport } from "@v1/set/schemas";
import type { Knex } from "knex";

/** Report a set.
 * Transactionally, create a record in the Set table, then create the matching pair
 * of records in SetResult table.
 */
export async function reportSet(set_report: SetReport): Promise<SetReport> {
    const trx = await knexDb.transaction();

    trx.commit();
}

/** Create a set, returning the incrementing set_id.
 * @param {guild_id} string - The guild in which the set was recorded.
 */
export async function createSet(guild_id: string, db: Knex = knexDb): Promise<number> {
    const set_id = await db("Set").insert({ guild_id });
    return set_id;
}

/** Create a record in SetResult. */
export async function createSetResult(
    set_id: number,
    user_id: string,
    game_count: number,
    db: Knex = knexDb,
): Promise<void> {
    return await db("SetResult").insert({ set_id, user_id, game_count });
}

/** Create a record in SetCharacterTable. */
export async function createSetCharacter(db: Knex, characters: Array<number>): Promise<number> {
    await db("SetCharacter").insert({});
    return;
}

// Consider some sort of fighly flexible minimal abstraction over SQL so that developer/user can provide any bounds to search in table
export async function getSets(user_id: string): Promise<Array<SetRecord>> {}
export async function getSetsNLast(user_id: string, n: number): Promise<Array<SetRecord>> {}
export async function getSetsDateRange(
    user_id: string,
    start: string,
    end: string,
): Promise<Array<SetRecord>> {}
