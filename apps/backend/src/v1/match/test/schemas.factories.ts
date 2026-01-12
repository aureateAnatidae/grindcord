import { rand_character_array, randint, snowflake } from "@test/factories";
import { MatchPlayer, type MatchReport } from "@v1/match/schemas";

export const matchPlayerFactory = (
    match_player?: Partial<MatchPlayer>,
): MatchPlayer => {
    return MatchPlayer.parse({
        user_id: snowflake(),
        win_count: randint(5),
        character: rand_character_array(),
        ...match_player,
    });
};

export const matchReportFactory = (
    match_report?: Partial<MatchReport>,
): MatchReport => {
    return {
        guild_id: snowflake(),
        players:
            match_report?.players ??
            (() => {
                const winnerWinCount = randint(5);
                const loserWinCount = randint(winnerWinCount);
                return [
                    matchPlayerFactory({ win_count: winnerWinCount }),
                    matchPlayerFactory({ win_count: loserWinCount }),
                ];
            })(),
        ...match_report,
    };
};
