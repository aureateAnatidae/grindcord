import { z } from "zod";

export const MatchRecord = z.object({
    match_id: z.int(),
    guild_id: z.string(),
    created_at: z.iso.datetime(),
});
export type MatchRecord = z.infer<typeof MatchRecord>;
export const MatchTable = {
    table_name: "Match",
    initialize(table) {
        table.increments("match_id");
        table.string("guild_id").index("guild_id_idx");
        // https://github.com/knex/knex/issues/6283
        table.timestamp("created_at").defaultTo(new Date().toISOString());
    },
};

export const MatchPlayerRecord = z.object({
    match_id: z.int(),
    user_id: z.string(),
    win_count: z.int(),
});
export type MatchPlayerRecord = z.infer<typeof MatchPlayerRecord>;
export const MatchPlayerTable = {
    table_name: "MatchPlayer",
    initialize(table) {
        table.primary(["match_id", "user_id"]);

        table.integer("match_id").unsigned();
        table.string("user_id");
        table.integer("win_count");

        table
            .foreign("match_id")
            .references("match_id")
            .inTable("Match")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
    },
};

export const MatchCharacterRecord = z.object({
    match_id: z.int(),
    user_id: z.string(),
    fighter_number: z.int(),
});
export type MatchCharacterRecord = z.infer<typeof MatchCharacterRecord>;
export const MatchCharacterTable = {
    table_name: "MatchCharacter",
    initialize(table) {
        table.primary(["match_id", "user_id"]);
        table.unique(["match_id", "user_id", "fighter_number"], {
            indexName: "match_character_idx",
            useConstraint: true,
        });

        table.integer("match_id").unsigned();
        table.string("user_id");
        table.integer("fighter_number").unsigned();

        table
            .foreign(["match_id", "user_id"])
            .references(["match_id", "user_id"])
            .inTable("MatchPlayer")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table
            .foreign("fighter_number")
            .references("fighter_number")
            .inTable("SSBUChar");
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
