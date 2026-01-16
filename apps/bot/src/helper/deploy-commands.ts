import type { CommandHandler } from "@command/types";
import { getLogger } from "@logtape/logtape";
import config from "config";
import type { RESTPutAPIApplicationCommandsResult } from "discord.js";
import { type Collection, REST, Routes } from "discord.js";

const log = getLogger(["bot"]);

export async function deploy_commands(commands: Collection<string, CommandHandler>) {
    if (!process.env.DISCORD_TOKEN) {
        throw Error("DISCORD_TOKEN is unset. Exiting");
    }
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    const _commands = commands.map((command) => command.data.toJSON());
    try {
        log.info(`Started refreshing ${_commands.length} application (/) commands.`);
        const data = (await rest.put(
            Routes.applicationCommands(config.APPLICATION_ID),
            {
                body: _commands,
            },
        )) as RESTPutAPIApplicationCommandsResult;
        log.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        log.error(error);
    }
}
