import type { Knex } from "knex";
import { z } from "zod";

export const GuildSeasonRecord = z.object({
    guild_id: z.string(),
    season_id: z.int(),
});
export type GuildSeasonRecord = z.infer<typeof GuildSeasonRecord>;
export const GuildSeasonTable = {
    table_name: "GuildSeason",
    initialize(table: Knex.TableBuilder) {
        table.primary(["guild_id"]);

        table.string("guild_id");
        table.integer("season_id");

        table
            .foreign("season_id")
            .references("season_id")
            .inTable("Season")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    },
};
