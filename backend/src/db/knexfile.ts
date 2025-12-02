import { SeedSource } from "@db/SeedSource";
import knex, { type Knex } from "knex";

// TODO: https://knexjs.org/guide/#log
export const config = {
    client: "better-sqlite3",
    connection: {
        filename: "./bot_data.db",
    },
    seeds: {
        seedSource: new SeedSource(),
    },
    useNullAsDefault: true,
};

export const knexDb: Knex = knex(config);
