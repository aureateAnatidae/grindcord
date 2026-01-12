import { randint, snowflake } from "@test/factories";
import type { GuildSeasonRecord } from "@v1/guild/models";

export const guildSeasonRecordFactory = (
    guild_season_record: Partial<GuildSeasonRecord> | undefined = undefined,
): GuildSeasonRecord => {
    return {
        guild_id: snowflake(),
        season_id: randint(100),
        ...guild_season_record,
    };
};
