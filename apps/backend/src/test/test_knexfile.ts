import { BaseSeedSource } from "@db/BaseSeedSource";
import knex, { type Knex } from "knex";

export const test_config: Knex.Config = {
    client: "better-sqlite3",
    connection: {
        filename: ":memory:",
    },
    seeds: {
        seedSource: new BaseSeedSource(),
    },
    useNullAsDefault: true,
};

export const test_knexDb: Knex = knex(test_config);
