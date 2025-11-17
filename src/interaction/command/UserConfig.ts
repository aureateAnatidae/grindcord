import readHelpFile from "@command/help/readHelpFile";
import { addNick, removeNick } from "@db/Nick";
import { version } from "@package";
import {
    type ApplicationCommand,
    type CacheType,
    type CommandInteraction,
    ContainerBuilder,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import pino from "pino";

const _log = pino();

// 'If you opt in, there\'s a 10% chance your name will change when you type a message starting with "im" or "i\'m"! You can also opt-out of this feature.'
const UserConfig: ApplicationCommand = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure the behaviour of meibot for yourself.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set")
                .setDescription("Set property")
                .addStringOption((option) =>
                    option
                        .setName("property")
                        .setDescription("Property to modify")
                        .setRequired(true)
                        .addChoices({ name: "nick-enabled", value: "nick-enabled" }),
                )
                .addStringOption((option) =>
                    option
                        .setName("value")
                        .setDescription(
                            "New value for the specified property (expected values for nick-enabled: [true, false])",
                        )
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("help").setDescription("Display the help message for /config"),
        ),
    async handleSetProperty(interaction: CommandInteraction<CacheType>) {
        const property = interaction.options.getString("property");
        const value = interaction.options.getString("value");

        switch (true) {
            case property === "nick-enabled" && value === "true": {
                const member = interaction.member;
                await addNick(member.user.id, member.guild.id);
                return;
            }
            case property === "nick-enabled" && value === "false": {
                const member = interaction.member;
                await removeNick(member.user.id, member.guild.id);
                return;
            }
        }
    },
    async handleHelp() {
        const config_help = await readHelpFile("UserConfigHelp");
        return new ContainerBuilder().addTextDisplayComponents(
            (helpHeader) => helpHeader.setContent(`# Meibot v${version}`),
            (configHeader) => configHeader.setContent(config_help),
        );
    },
    async execute(interaction: CommandInteraction<CacheType>) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "set": {
                await this.handleSetProperty(interaction);
                await interaction.reply({
                    content: "Successfully set property.",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
            case "help": {
                await interaction.reply({
                    components: [await this.handleHelp()],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                });
                return;
            }
            default:
                await interaction.reply({
                    content: "Invalid subcommand (should be impossible to reach)",
                    flags: MessageFlags.Ephemeral,
                });
                throw Error(`Unexpected subcommand passed to /config: ${subcommand}`);
        }
    },
};

export default UserConfig;
