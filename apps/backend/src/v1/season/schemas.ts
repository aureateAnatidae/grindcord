import { z } from "zod";

export const Season = z.object({
    guild_id: z.array(z.string()),
    season_name: z.string(),
    start_at: z.iso.datetime(),
    end_at: z.iso.datetime(),
});
export type Season = z.infer<typeof Season>;

export const SeasonQuery = z
    .object({
        guild_id: z.string(),
        season_name: z.string(),
        after: z.iso.datetime(),
        before: z.iso.datetime(),
    })
    .partial();
export type SeasonQuery = z.infer<typeof SeasonQuery>;
