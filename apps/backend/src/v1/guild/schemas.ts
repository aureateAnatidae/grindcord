import { z } from "zod";

export const GuildSeason = z.object({
    guild_id: z.string(),
    season_id: z.int(),
});
export type GuildSeason = z.infer<typeof GuildSeason>;

export const GuildId = z.object({
    guild_id: z.string(),
});
export type GuildId = z.infer<typeof GuildId>;
