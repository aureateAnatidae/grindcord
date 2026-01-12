import { BaseSeedSource } from "@db/CustomSeedSource";
import config from "config";
import knex, { type Knex } from "knex";

// TODO: https://knexjs.org/guide/#log
export const production_config: Knex.Config<Knex.Sqlite3ConnectionConfig> = {
    client: "better-sqlite3",
    connection: {
        filename: "./grindcord.db",
    },
    seeds: {
        seedSource: new BaseSeedSource(),
    },
    useNullAsDefault: true,
};

export const test_config: Knex.Config<Knex.Sqlite3ConnectionConfig> = {
    client: "better-sqlite3",
    connection: {
        filename: ":memory:",
    },
    seeds: {
        seedSource: new BaseSeedSource(),
    },
    useNullAsDefault: true,
};

export const knexDb: Knex = knex(
    config.NODE_ENV === "test" ? test_config : production_config,
);
