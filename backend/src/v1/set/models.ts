import { knexDb } from "@db/knexfile";

export const SetTable = {
    table_name: "Set",
    initialize(table) {
        table.increments("set_id");
        table.string("guild_id").index("guild_id_idx");
        // https://github.com/knex/knex/issues/6283
        table.timestamp("created_at").defaultTo(new Date().toISOString());
    },
};

export const SetResultTable = {
    table_name: "SetResult",
    initialize(table) {
        table.primary(["set_id", "user_id"]);

        table.integer("set_id").unsigned();
        table.string("user_id");
        table.integer("game_count");

        table.foreign("set_id").references("set_id").inTable("Set");
    },
};

export const SetCharacterTable = {
    table_name: "SetCharacter",
    initialize(table) {
        table.primary(["set_id", "user_id"]);
        table.unique(["set_id", "user_id", "fighter_number"], {
            indexName: "set_character_idx",
            useConstraint: true,
        });

        table.integer("set_id").unsigned();
        table.string("user_id");
        table.integer("fighter_number").unsigned();

        table.foreign(["set_id", "user_id"]).references(["set_id", "user_id"]).inTable("SetResult");
        table.foreign("fighter_number").references("fighter_number").inTable("SSBUChar");
    },
};

// Lookup table for SSBU characters
export const SSBUCharTable = {
    table_name: "SSBUChar",
    initialize(table) {
        table.increments("fighter_number");
        table.string("character_name");
    },
};
