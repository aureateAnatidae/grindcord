import { ssbu_character_names } from "@db/character/names";

// Lookup table for SSBU characters
export const SSBUCharTable = {
    table_name: "SSBUChar",
    initialize(table) {
        table.increments("fighter_number");
        table.string("character_name");
    },
};
