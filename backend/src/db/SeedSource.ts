import { seed as SSBUCharacters_seed } from "@seeds/SSBUCharacters";
import pino from "pino";

const log = pino();

// Seek more customizable API where list of seeds can be provided to the seedsource
export class SeedSource {
    getSeeds() {
        return Promise.resolve(["SSBUCharacters"]);
    }

    getSeed(seed) {
        log.info(`Seeding ${seed}`);
        switch (seed) {
            case "SSBUCharacters":
                return {
                    async seed(knex) {
                        await SSBUCharacters_seed(knex);
                    },
                };
        }
    }
}
