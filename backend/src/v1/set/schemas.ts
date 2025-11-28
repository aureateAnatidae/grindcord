import { z } from "zod";
import { ssbu_character_names } from "@v1/../../seeds/SSBUCharacters";

export const SetReport = z.object({
    guild_id: z.string(),
    
    winner_id: z.string(),
    winner_tier: z.int(),
    winner_count: z.int(),
    winner_character: z.array(z.enum(ssbu_character_names)),

    loser_id: z.string(),
    loser_tier: z.int(),
    loser_count: z.int(),
    loser_character: z.array(z.enum(ssbu_character_names)),
});
export type SetReport = z.infer<typeof SetReport>;

export const SetRecord = z.object({
    set_id: z.int(),  // should not be exposed
    guild_id: z.string(),
    created_at: z.iso.datetime()
});
export type SetRecord = z.infer<typeof SetRecord>;
