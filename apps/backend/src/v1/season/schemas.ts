import { z } from "zod";

export const Season = z.object({
    season_id: z.int(),
    guild_id: z.array(z.string()),
    season_name: z.string(),
    start_at: z.iso.datetime(),
    end_at: z.iso.datetime(),
});
export type Season = z.infer<typeof Season>;

export const SeasonQuery = z
    .object({
        season_id: z.int(),
        guild_id: z.string(),
        season_name: z.string(),
        during: z.iso.datetime(),
    })
    .partial();
export type SeasonQuery = z.infer<typeof SeasonQuery>;
