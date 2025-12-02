import type { Knex } from "knex";

export const MatchWinnerView = (db: Knex) => ({
    view_name: "MatchWinnerView",
    initialize(view) {
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
