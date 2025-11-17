import knex, { type Knex } from "knex";

export const test_config = {
    client: "better-sqlite3",
    connection: {
        filename: "./test.db",
    },
    useNullAsDefault: true,
};

export const test_knexDb: Knex = knex(test_config);
