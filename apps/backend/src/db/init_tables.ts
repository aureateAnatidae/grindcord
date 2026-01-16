import { knexDb } from "@db/knexfile";
import { getLogger } from "@logtape/logtape";
import { GuildSeasonTable } from "@v1/guild/models";
import {
    MatchCharacterTable,
    MatchPlayerTable,
    MatchTable,
    SSBUCharTable,
} from "@v1/match/models";
import { MatchReportView, MatchWinnerView } from "@v1/match/views";
import { SeasonTable } from "@v1/season/models";
import type { Knex } from "knex";

const log = getLogger(["backend", "db"]);

const tables = [
    MatchTable,
    MatchPlayerTable,
    MatchCharacterTable,
    SSBUCharTable,
    SeasonTable,
    GuildSeasonTable,
];
const views = [MatchWinnerView, MatchReportView];

async function create_table_if_notexists(
    tableName: string,
    callback: (tableBuilder: Knex.CreateTableBuilder) => void,
    db: Knex = knexDb,
): Promise<Knex.SchemaBuilder> {
    const exists = await db.schema.hasTable(tableName);
    if (!exists) {
        log.info(`${tableName} table not found. Creating table for ${tableName}.`);
        await db.schema.createTable(tableName, callback);
        log.info(`${tableName} table successfully initialized.`);
    } else {
        log.info(
            `Database already contains ${tableName} table. Skipping initialization.`,
        );
    }
}

export async function init_tables(db: Knex = knexDb): Promise<void> {
    const trx = await db.transaction();
    for (const table of tables) {
        await create_table_if_notexists(table.table_name, table.initialize, trx);
    }
    await trx.seed.run();
    await trx.commit();
}

export async function init_views(db: Knex = knexDb) {
    const trx = await db.transaction();
    for (const _view of views) {
        const view = _view(db);
        await trx.schema.createViewOrReplace(view.view_name, view.initialize);
        log.info(`${view.view_name} view successfully initialized.`);
    }
    await trx.commit();
}

export async function teardown(db: Knex = knexDb) {
    if (process.env.NODE_ENV === "production") {
        log.error(
            "`teardown` was called on a production database -- no action will be performed",
        );
        return;
    }
    const trx = await db.transaction();
    for (const table of tables) {
        await trx.schema.dropTableIfExists(table.table_name);
    }
    await trx.commit();
    log.info("Successfully performed `teardown` on database");
}
