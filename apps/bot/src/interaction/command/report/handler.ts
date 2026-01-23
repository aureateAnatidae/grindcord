import {
    initializeReportMatchInterface,
} from "@command/report/component";
import type { CommandHandler } from "@command/types";
import { getLogger } from "@logtape/logtape";
import {
    SlashCommandBuilder,
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
