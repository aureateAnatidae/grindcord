// General utilities for generating test data

import { ssbu_character_names } from "@db/seeds/SSBUCharacters";
import { faker } from "@faker-js/faker";

export const snowflake = () =>
    faker.string.numeric({
        length: 18,
    });

export const randint = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const rand_character_array = (): Array<
    (typeof ssbu_character_names)[number]
> => [
    ...new Set(
        Array.from(
            { length: 1 + randint(4) },
            () => ssbu_character_names[randint(ssbu_character_names.length)],
        ),
    ),
];
