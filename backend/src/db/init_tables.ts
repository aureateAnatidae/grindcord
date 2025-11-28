import { knexDb } from "@db/knexfile";
import { SetCharacterTable, SetResultTable, SetTable, SSBUCharTable } from "@v1/set/models";
import type { Knex } from "knex";

import pino from "pino";

const log = pino();

const tables = [SetTable, SetResultTable, SetCharacterTable, SSBUCharTable];

async function create_table_if_notexists(
    db: Knex = knexDb,
    tableName: string,
    callback: (tableBuilder: Knex.CreateTableBuilder) => void,
): Promise<Knex.SchemaBuilder> {
    const exists = await db.schema.hasTable(tableName);
    if (!exists) {
        log.info(`${tableName} table not found. Creating table for ${tableName}.`);
        await db.schema.createTable(tableName, callback);
        log.info(`${tableName} table successfully initialized.`);
    } else {
        log.info(`Database already contains ${tableName} table. Skipping initialization.`);
    }
}

export async function init_tables(db: Knex = knexDb) {
    const trx = await db.transaction();
    for (const table of tables) {
        await create_table_if_notexists(trx, table.table_name, table.initialize);
    }
    await trx.seed.run();
    await trx.commit();
}

export async function teardown(db: Knex = knexDb) {
    if (process.env.NODE_ENV === "production") {
        log.error("`teardown` was called on a production database -- no action will be performed");
        return;
    }
    const trx = await db.transaction();
    for (const table of tables) {
        await trx.schema.dropTableIfExists(table.table_name);
    }
    await trx.commit();
    log.info("Successfully performed `teardown` on database");
}
