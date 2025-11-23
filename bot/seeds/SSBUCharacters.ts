import { ssbu_character_names } from "@db/character/names";

export async function seed(knex) {
    await knex("SSBUChar").del();
    await knex("SSBUChar").insert(
        ssbu_character_names.map((character_name) => {
            return { character_name };
        }),
    );
}
