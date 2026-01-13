import { SSBUCharFighterNumber } from "@v1/match/schemas";
import type { Knex } from "knex";
import { z } from "zod";

export const MatchWinnerView = (db: Knex) => ({
    view_name: "MatchWinnerView",
    initialize(view: Knex.ViewBuilder) {
        view.columns(["match_id", "user_id", "win_count"]);
        view.as(
            db("MatchPlayer as sp")
                .select(["match_id", "win_count"])
                .where(
                    "sp.win_count",
                    "=",
                    db("MatchPlayer as sp2")
                        .max("win_count")
                        .where("sp2.game_id", db.ref("sp.game_id")),
                ),
        );
    },
});

export const MatchReportDerivedRow = z.object({
    match_id: z.int(),
    season_id: z.int(),
    guild_id: z.string(),
    user_id: z.string(),
    win_count: z.int(),
    fighter_number: SSBUCharFighterNumber,
    created_at: z.iso.datetime(),
});
export type MatchReportDerivedRow = z.infer<typeof MatchReportDerivedRow>;
export const MatchReportView = (db: Knex) => ({
    view_name: "MatchReportView",
    initialize(view: Knex.ViewBuilder) {
        view.columns([
            "match_id",
            "season_id",
            "guild_id",
            "user_id",
            "win_count",
            "fighter_number",
            "created_at",
        ]);
        view.as(
            db("Match")
                .leftJoin("MatchPlayer", "Match.match_id", "MatchPlayer.match_id")
                .leftJoin("MatchCharacter", "Match.match_id", "MatchCharacter.match_id")
                .select(
                    "Match.match_id as match_id",
                    "Match.season_id as season_id",
                    "Match.guild_id as guild_id",
                    "MatchPlayer.user_id as user_id",
                    "MatchPlayer.win_count as win_count",
                    "MatchCharacter.fighter_number as fighter_number",
                    "Match.created_at as created_at",
                ),
        );
    },
});
