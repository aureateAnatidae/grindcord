import type {
    CacheType,
    CommandInteraction,
    ContextMenuCommandBuilder,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type CommandHandler = {
    data:
        | SlashCommandBuilder
        | ContextMenuCommandBuilder
        | SlashCommandOptionsOnlyBuilder
        | SlashCommandSubcommandsOnlyBuilder;
    execute(interaction: CommandInteraction<CacheType>): Promise<void>;
};
