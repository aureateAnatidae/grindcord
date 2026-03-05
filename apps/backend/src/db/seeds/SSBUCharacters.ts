import { ssbu_characters } from "@src/characters";
import type { Knex } from "knex";

export async function seed(knex: Knex) {
    await knex("SSBUChar").del();
    await knex("SSBUChar").insert(
        ssbu_characters.map((character_name) => {
            return { character_name };
        }),
    );
}
