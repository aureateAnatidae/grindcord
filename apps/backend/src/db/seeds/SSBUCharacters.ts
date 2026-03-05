import { ssbu_character_names } from "@src/characters";
import type { Knex } from "knex";

export async function seed(knex: Knex) {
    await knex("SSBUChar").del();
    await knex("SSBUChar").insert(
        ssbu_character_names.map((character_name) => {
            return { character_name };
        }),
    );
}
