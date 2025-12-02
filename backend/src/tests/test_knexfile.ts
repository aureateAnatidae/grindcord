import { MockSeedSource } from "@tests/MockSeedSource";
import knex, { type Knex } from "knex";

export const test_config: Knex.Config = {
    client: "better-sqlite3",
    connection: {
        filename: ":memory:",
    },
    seeds: {
        seedSource: new MockSeedSource(),
    },
    useNullAsDefault: true,
};

export const test_knexDb: Knex = knex(test_config);
