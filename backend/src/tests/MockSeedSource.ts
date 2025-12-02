import { seed as SSBUCharacters_seed } from "@seeds/SSBUCharacters";
import { seed as FakeMatches_seed } from "@v1/match/tests/mock.models";
import pino from "pino";

const log = pino();

export class MockSeedSource {
    getSeeds() {
        return Promise.resolve(["SSBUCharacters", "FakeMatches"]);
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
            case "FakeMatches":
                return {
                    async seed(knex) {
                        await FakeMatches_seed(knex);
                    },
                };
        }
    }
}
