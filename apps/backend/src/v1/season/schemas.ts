import { z } from "zod";

export const Season = z.object({
    season_id: z.int(),
    season_name: z.string(),
    start_at: z.iso.datetime(),
    end_at: z.iso.datetime(),
});
export type Season = z.infer<typeof Season>;

export const SeasonCreate = Season.omit({
    season_id: true,
});
export type SeasonCreate = z.infer<typeof SeasonCreate>;

export const SeasonId = z.object({
    season_id: z.coerce.number(),
});
export type SeasonId = z.infer<typeof SeasonId>;

export const SeasonQuery = z
    .object({
        season_name: z.string(),
        after: z.iso.datetime(),
        before: z.iso.datetime(),
    })
    .partial();
export type SeasonQuery = z.infer<typeof SeasonQuery>;
