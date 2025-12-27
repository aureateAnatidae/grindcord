import type { Knex } from "knex";
import { z } from "zod";

export const SeasonRecord = z.object({
    season_id: z.int(),
    guild_id: z.string(),
    season_name: z.string(),
    start_at: z.iso.datetime(),
    end_at: z.iso.datetime(),
});
export type SeasonRecord = z.infer<typeof SeasonRecord>;
export const SeasonTable = {
    table_name: "Season",
    initialize(table: Knex.TableBuilder) {
        table.primary(["season_id", "guild_id"]);

        table.increments("season_id");
        table.string("guild_id");

        table.string("season_name");
        table.dateTime("start_at");
        table.dateTime("end_at");
    },
};
