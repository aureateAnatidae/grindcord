import { GuildId, GuildSeason } from "@v1/guild/schemas";
import { getGuildSeason, upsertGuildSeason } from "@v1/guild/service";
import { SeasonId } from "@v1/season/schemas";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";

const app = new Hono();

app.get(
    "/season/:guild_id",
    describeRoute({
        description: "Get the guild's currently active season",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(GuildSeason),
                    },
                },
            },
            400: {
                description: "No GuildSeason found for the provided `guild_id`",
            },
        },
    }),
    validator("param", GuildId),
    async (c) => {
        const { guild_id } = c.req.valid("param");
        const guild_season: GuildSeason | null = await getGuildSeason(guild_id);
        return guild_season ? c.json({ guild_season }) : c.notFound();
    },
);

app.post(
    "/season/:guild_id",
    describeRoute({
        description: "Change the guild's currently active season",
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(GuildSeason),
                    },
                },
            },
        },
    }),
    validator("param", GuildId),
    validator("json", SeasonId),
    async (c) => {
        const { guild_id } = c.req.valid("param");
        const { season_id } = c.req.valid("json");
        const guild_season: GuildSeason | null = await upsertGuildSeason(
            guild_id,
            season_id,
        );
        return c.json({ guild_season });
    },
);

export default app;
