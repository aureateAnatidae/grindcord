import { seed as SSBUCharacters_seed } from "@db/seeds/SSBUCharacters";
import { getLogger } from "@logtape/logtape";
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
