import { ssbu_character_names } from "@seeds/SSBUCharacters";
import { z } from "zod";

export const Match = z.object({
    match_id: z.int(),
    guild_id: z.string(),
    created_at: z.iso.datetime(),
});
export const MatchPlayer = z.object({
    user_id: z.string(),
    win_count: z.int(),
    character: z.array(z.enum(ssbu_character_names)),
});
export type MatchPlayer = z.infer<typeof MatchPlayer>;
export const MatchReport = z.object({
    guild_id: z.string(),
    players: z.array(MatchPlayer),
});
export type MatchReport = z.infer<typeof MatchReport>;
