import { z } from "zod";

export const SetReport = z.object({
    winner_id: z.string(),
    winner_tier: z.int(),
    winner_count: z.int(),
    winner_character: z.array(z.templateLiteral([z.int(), z.enum(ssbu_character_names)])),

    loser_id: z.string(),
    loser_tier: z.int(),
    loser_count: z.int(),
    lower_character: z.array(z.templateLiteral([z.int(), z.enum(ssbu_character_names)])),
});
export type SetReport = z.infer<typeof SetReport>;

export const SetRecord = SetReport.extend({
    timestamp: z.timestamp()
});
export type SetRecord = z.infer<typeof SetRecord>;
