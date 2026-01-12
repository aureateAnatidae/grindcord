import { ssbu_character_names } from "@db/seeds/SSBUCharacters";
import { z } from "zod";

export const SSBUCharEnum = z.enum(ssbu_character_names);
export type SSBUCharEnum = z.infer<typeof SSBUCharEnum>;

export const SSBUCharFighterNumber = z
    .int()
    .min(1)
    .max(ssbu_character_names.length + 1);
export type SSBUCharFighterNumber = z.infer<typeof SSBUCharFighterNumber>;

export const SSBUCharEnumToFighterNumber = z.codec(
    SSBUCharEnum,
    SSBUCharFighterNumber,
    {
        encode: (fighter_number: SSBUCharFighterNumber) =>
            ssbu_character_names[fighter_number - 1],
        decode: (character_name: SSBUCharEnum) =>
            ssbu_character_names.indexOf(character_name) + 1,
    },
);

export const MatchPlayer = z.object({
    user_id: z.string(),
    win_count: z.int(),
    character: z.array(SSBUCharEnumToFighterNumber),
});
export type MatchPlayer = z.infer<typeof MatchPlayer>;

export const MatchReport = z.object({
    guild_id: z.string(),
    players: z.array(MatchPlayer),
});
export type MatchReport = z.infer<typeof MatchReport>;

export const MatchQuery = z
    .object({
        match_id: z.coerce.number(),
        guild_id: z.string(),
        user_id: z.string(),
        character: SSBUCharEnumToFighterNumber,
        before_datetime: z.iso.datetime(),
        after_datetime: z.iso.datetime(),
    })
    .partial();
export type MatchQuery = z.infer<typeof MatchQuery>;
