import knex, { type Knex } from "knex";
import { BaseSeedSource } from "./BaseSeedSource";

// TODO: https://knexjs.org/guide/#log
export const config: Knex.Config<Knex.Sqlite3ConnectionConfig> = {
    client: "better-sqlite3",
    connection: {
        filename: "./grindcord.db",
    },
    seeds: {
        seedSource: new BaseSeedSource(),
    },
    useNullAsDefault: true,
};

export const knexDb: Knex = knex(config);
