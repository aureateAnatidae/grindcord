import { seed as SSBUCharacters_seed } from "@db/seeds/SSBUCharacters";
import { getLogger } from "@logtape/logtape";
import type { GuildSeasonRecord } from "@v1/guild/models";
import type { MatchPlayerRecord, MatchRecord } from "@v1/match/models";
import type { SeasonRecord } from "@v1/season/models";
import type { Knex } from "knex";

const log = getLogger(["grindcord", "db"]);

// Seek more customizable API where list of seeds can be provided to the seedsource
export class BaseSeedSource {
    getSeeds() {
        return Promise.resolve(["SSBUCharacters"]);
    }

    async getSeed(seed: string) {
        log.info(`Seeding ${seed}`);
        switch (seed) {
            case "SSBUCharacters":
                return {
                    async seed(knex: Knex) {
                        await SSBUCharacters_seed(knex);
                    },
                };
            default:
                throw new Error(`Invalid seed: "${seed}"`);
        }
    }
}

// Insert any records into the table
type InsertSeedSourceProps = {
    Match?: Array<Omit<MatchRecord, "match_id" | "created_at">>;
    MatchPlayer?: Array<MatchPlayerRecord>;
    Season?: Array<Omit<SeasonRecord, "season_id">>;
    GuildSeason?: Array<GuildSeasonRecord>;
};
export class InsertSeedSource {
    insertables: InsertSeedSourceProps;
    constructor(insertables: InsertSeedSourceProps) {
        this.insertables = insertables;
    }

    getSeeds() {
        const keys = Object.keys(this.insertables) as Array<
            keyof InsertSeedSourceProps
        >;
        return Promise.resolve(keys);
    }

    async getSeed(seed: keyof InsertSeedSourceProps) {
        const records = this.insertables[seed as keyof InsertSeedSourceProps];
        if (records === undefined) {
            throw new Error(
                "An undefined attribute was used as an argument in InsertSeedSource.",
            );
        }
        return {
            async seed(knex: Knex) {
                let i: keyof typeof records;
                for (i in records) {
                    await knex(seed).insert(records[i]);
                }
            },
        };
    }
}
