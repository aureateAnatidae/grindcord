import { getLogger } from "@logtape/logtape";
import { seed as SSBUCharacters_seed } from "@seeds/SSBUCharacters";
import { seed as FakeMatches_seed } from "@v1/match/test/mock.models";
import type { Knex } from "knex";

const log = getLogger(["grindcord", "db", "test"]);

export class MockSeedSource {
    getSeeds() {
        return Promise.resolve(["SSBUCharacters", "FakeMatches"]);
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
            case "FakeMatches":
                return {
                    async seed(knex: Knex) {
                        await FakeMatches_seed(knex);
                    },
                };
            default:
                throw new Error(`Invalid seed: "${seed}"`);
        }
    }
}
