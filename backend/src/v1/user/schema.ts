import { z } from "zod";

export const guildMemberQuery = z.object({
    user_id: z.string(),
    guild_id: z.string(),
});
export type guildMemberQuery = z.infer<typeof guildMemberQueryBase>;
