import { faker } from "@faker-js/faker";
import type { SeasonCreate } from "@v1/season/schemas";

export const seasonCreateFactory = (
    season_create: SeasonCreate | undefined = undefined,
): SeasonCreate => {
    return {
        season_name: faker.animal.fish(),
        start_at: faker.date.recent().toISOString(),
        end_at: faker.date.soon().toISOString(),
        ...season_create,
    };
};
