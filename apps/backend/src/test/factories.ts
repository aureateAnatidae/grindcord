// General utilities for generating test data

import { faker } from "@faker-js/faker";
import { ssbu_characters } from "@src/characters";

export const snowflake = () =>
    faker.string.numeric({
        length: 18,
    });

export const randint = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const rand_character_array = (): Array<
    (typeof ssbu_characters)[number]
> => [
    ...new Set(
        Array.from(
            { length: 1 + randint(4) },
            () => ssbu_characters[randint(ssbu_characters.length)],
        ),
    ),
];
