import { GuildId, GuildSeason } from "@v1/guild/schemas";
import {
    getGuildSeason,
    insertGuildSeason,
    updateGuildSeason,
} from "@v1/guild/service";
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
        description: "Create a guild's registration to a season",
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
        const guild_season: GuildSeason = await insertGuildSeason(guild_id, season_id);
        return c.json({ guild_season });
    },
);

app.patch(
    "/season/:guild_id",
    describeRoute({
        description: "Change a guild's currently active season",
        responses: {
            200: {
                description: "Successful response",
                content: {},
            },
        },
    }),
    validator("param", GuildId),
    validator("json", SeasonId),
    async (c) => {
        const { guild_id } = c.req.valid("param");
        const { season_id } = c.req.valid("json");
        const affected_rows: number = await updateGuildSeason(guild_id, season_id);
        return affected_rows === 0 ? c.notFound() : c.status(200);
    },
);
export default app;
