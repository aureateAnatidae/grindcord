import { command_handlers } from "@command";
import { init_tables, teardown } from "@db/init_tables";
import { event_handlers } from "@event";
import { Client, Collection, GatewayIntentBits, MessageFlags } from "discord.js";
import deploy_commands from "helper/deploy-commands";
import pino from "pino";

const log = pino(); // TODO: Unify, just use one logger? Import from a logging config file? Child loggers?

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

// Registers each command to the client
if (process.env.SKIP_DEPLOY_COMMANDS !== "1") {
    client.commands = new Collection();
    for (const command of command_handlers) {
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            log.warn(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            );
        }
    }
    await deploy_commands(client.commands);
} else {
    log.info("SKIP_DEPLOY_COMMANDS specified. Skipping registration of commands to Discord.");
}

client.on("interactionCreate", async (interaction) => {
    // Check to make sure interaction is a command
    if (!interaction.isCommand()) return;
    // Check to make sure user is not a bot.
    if (interaction.user.bot) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (err) {
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
for (const event of event_handlers) {
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => {
            event.execute(...args);
        });
    }
}

client.login(process.env.DISCORD_TOKEN);
