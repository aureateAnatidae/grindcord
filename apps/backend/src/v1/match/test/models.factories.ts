import { ssbu_character_names } from "@db/seeds/SSBUCharacters";
import { randint, snowflake } from "@test/factories";
import type {
    MatchCharacterRecord,
    MatchPlayerRecord,
    MatchRecord,
} from "@v1/match/models";

export const matchRecordFactory = (
    match_record: Partial<MatchRecord> | undefined = undefined,
): Omit<MatchRecord, "match_id" | "created_at"> => {
    return {
        guild_id: snowflake(),
        ...match_record,
    };
};

export const matchPlayerRecordFactory = (
    match_player_record: Partial<MatchPlayerRecord> | undefined = undefined,
): MatchPlayerRecord => {
    return {
        match_id: randint(1000),
        user_id: snowflake(),
        win_count: randint(50),
        ...match_player_record,
    };
};

export const matchCharacterRecordFactory = (
    match_character_record: Partial<MatchCharacterRecord> | undefined = undefined,
): MatchCharacterRecord => {
    return {
        match_id: randint(1000),
        user_id: snowflake(),
        fighter_number: randint(ssbu_character_names.length),
        ...match_character_record,
    };
};
