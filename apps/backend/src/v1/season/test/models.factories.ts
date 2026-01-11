import { faker } from "@faker-js/faker";
import type { SeasonRecord } from "@v1/season/models";
import type { Knex } from "knex";

export const seasonRecordFactory = (
    season_record: Partial<SeasonRecord> | undefined = undefined,
): Omit<SeasonRecord, "season_id"> => {
    return {
        season_name: faker.animal.fish(),
        start_at: faker.date.recent().toISOString(),
        end_at: faker.date.soon().toISOString(),
        ...season_record,
    };
};

export const currentSeasonRecordFactory = (
    season_record:
        | Partial<Omit<SeasonRecord, "start_at" | "end_at">>
        | undefined = undefined,
): Omit<SeasonRecord, "season_id"> => {
    const season_name = `Current Season - ${faker.animal.fish()}`;
    return seasonRecordFactory({ season_name, ...season_record });
};

export const pastSeasonRecordFactory = (
    season_record:
        | Partial<Omit<SeasonRecord, "start_at" | "end_at">>
        | undefined = undefined,
): Omit<SeasonRecord, "season_id"> => {
    const season_name = `Past Season - ${faker.animal.fish()}`;

    const end_at = faker.date.recent().toISOString();
    const start_at = faker.date.past({ refDate: end_at }).toISOString();
    return seasonRecordFactory({ season_name, start_at, end_at, ...season_record });
};

export const futureSeasonRecordFactory = (
    season_record:
        | Partial<Omit<SeasonRecord, "start_at" | "end_at">>
        | undefined = undefined,
): Omit<SeasonRecord, "season_id"> => {
    const season_name = `Future Season - ${faker.animal.fish()}`;

    const start_at = faker.date.soon().toISOString();
    const end_at = faker.date.future({ refDate: start_at }).toISOString();
    return seasonRecordFactory({ season_name, start_at, end_at, ...season_record });
};

export async function seed(
    knex: Knex,
    season_records: Array<SeasonRecord>,
): Promise<void> {
    await knex<SeasonRecord>("Season").insert(season_records);
}
