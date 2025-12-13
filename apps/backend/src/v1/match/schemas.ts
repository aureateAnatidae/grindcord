import { ssbu_character_names } from "@seeds/SSBUCharacters";
import { z } from "zod";

export const SSBUCharEnum = z.enum(ssbu_character_names);
export type SSBUCharEnum = z.infer<typeof SSBUCharEnum>;

export const SSBUCharEnumToInt = z.codec(SSBUCharEnum, z.int(), {
    encode: (fighter_number: number) => ssbu_character_names[fighter_number - 1],
    decode: (character_name: SSBUCharEnum) =>
        ssbu_character_names.indexOf(character_name) + 1,
});

export const MatchPlayer = z.object({
    user_id: z.string(),
    win_count: z.int(),
    character: z.array(SSBUCharEnumToInt),
});
export type MatchPlayer = z.infer<typeof MatchPlayer>;

export const MatchReport = z.object({
    guild_id: z.string(),
    players: z.array(MatchPlayer),
});
export type MatchReport = z.infer<typeof MatchReport>;
