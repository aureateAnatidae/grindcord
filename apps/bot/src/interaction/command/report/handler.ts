import {
    confirmReport,
    initializeReportMatchInterface,
    selectUsersPage,
} from "@command/report/component";
import type { CommandHandler } from "@command/types";
import { getLogger } from "@logtape/logtape";
import {
    Collection,
    type CommandInteraction,
    ComponentType,
    ContainerBuilder,
    type InteractionCallbackResponse,
    type Message,
    type MessageComponentInteraction,
    MessageFlags,
    SlashCommandBuilder,
    type User,
} from "discord.js";

const log = getLogger(["bot"]);

const reportMatch: CommandHandler = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report your set to Grindcord"),

    async execute(interaction): Promise<void> {
        if (!interaction.inGuild) return;

        await initializeReportMatchInterface(interaction);
    },
};

export default reportMatch;
