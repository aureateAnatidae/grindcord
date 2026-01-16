import reportMatch from "@command/report";
import type { CommandHandler } from "@command/types";
import ClientReady from "@event/ClientReady";
import type { EventHandler } from "@event/types";
import { deploy_commands } from "@helper/deploy-commands";
import { getLogger } from "@logtape/logtape";
import config from "config";
import { Client, Collection, GatewayIntentBits, MessageFlags } from "discord.js";
import { logConfigure } from "logging";

const command_handlers: Array<CommandHandler> = [reportMatch];
const event_handlers: Array<EventHandler> = [ClientReady];

await logConfigure();

const log = getLogger(["bot"]);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const commands: Collection<string, CommandHandler> = new Collection();
// Registers each command to the client
if (process.env.SKIP_DEPLOY_COMMANDS !== "1") {
    for (const command of command_handlers) {
        commands.set(command.data.name, command);
    }
    await deploy_commands(commands);
} else {
    log.info(
        "SKIP_DEPLOY_COMMANDS specified. Skipping registration of commands to Discord.",
    );
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.user.bot) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (err: any) {
        log.error(err);
        if (interaction.replied || interaction.deferred) {
            interaction.followUp({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            });
        } else {
            interaction.reply({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});

// Registers each event's signal to its respective `execute` on the client.
// for (const event of event_handlers) {
//     if (event.once) {
//         client.once(event.name, (...args) => event.execute(...args));
//     } else {
//         client.on(event.name, (...args) => {
//             event.execute(...args);
//         });
//     }
// }

client.login(config.DISCORD_TOKEN);
