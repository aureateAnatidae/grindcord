import { ssbu_character_names } from "@db/character/names";
import { knexDb } from "@db/knexfile";

export const SetTable = {
    table_name: "Set",
    initialize(table) {
        table.increments("set_id");
        table.timestamp("created_at").defaultTo(knexDb.fn.now());
    },
};

export const SetResultTable = {
    table_name: "SetResult",
    initialize(table) {
        table.primary(["set_id", "user_id"]);

        table.integer("set_id").unsigned();
        table.string("user_id");
        table.integer("game_count");
        table.integer("is_win").checkIn([0, 1]);

        table.foreign("set_id").references("set_id").inTable("Set");
    },
};

export const SetCharacterTable = {
    table_name: "SetCharacter",
    initialize(table) {
        table.primary(["set_id", "user_id", "fighter_number"]);

        table.integer("set_id").unsigned();
        table.string("user_id");
        table.integer("fighter_number").unsigned();

        table.foreign(["set_id", "user_id"]).references(["set_id", "user_id"]).inTable("SetResult");
        table.foreign("fighter_number").references("fighter_number").inTable("SSBUChar");
    },
};
