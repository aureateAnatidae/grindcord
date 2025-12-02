// General utilities for generating mock data
import { faker } from "@faker-js/faker";
import { ssbu_character_names } from "@seeds/SSBUCharacters";

export const snowflake = () =>
    faker.string.numeric({
        length: 18,
    });

export const randint = (max) => {
    return Math.floor(Math.random() * max);
};

export const rand_character_array: Array<(typeof ssbu_character_names)[number]> = () =>
    Array.from(
        { length: 1 + randint(4) },
        () => ssbu_character_names[randint(ssbu_character_names.length)],
    );
