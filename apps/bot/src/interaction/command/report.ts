import type { CommandHandler } from "@command/types";
import { ssbu_character_choices } from "@helper/SSBUCharacters";
import { getLogger } from "@logtape/logtape";
import {
    ActionRowBuilder,
    APIUserInteractionDataResolved,
    APIUserSelectComponent,
    type CacheType,
    ComponentType,
    ContainerBuilder,
    type InteractionCallbackResponse,
    InteractionContextType,
    MessageFlags,
    SelectMenuType,
    SlashCommandBuilder,
    UserSelectMenuBuilder,
    type UserSelectMenuInteraction,
} from "discord.js";

const log = getLogger(["bot"]);

const reportMatch: CommandHandler = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report your set to Grindcord"),
    async execute(interaction): Promise<void> {
        if (!interaction.channel) return;
        // await interaction.reply("A match is reported.");
        const selectPlayersPage = new ContainerBuilder()
            .addTextDisplayComponents((title) => title.setContent("# Report a Set"))
            .addActionRowComponents((actionRow) =>
                actionRow.setComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId("players")
                        .setPlaceholder("Who played in this set?")
                        .setMinValues(1)
                        .setMaxValues(4),
                ),
            );

        const user_ids_reply: InteractionCallbackResponse<boolean> =
            await interaction.reply({
                components: [selectPlayersPage],
                flags: MessageFlags.IsComponentsV2,
                withResponse: true,
            });

        const user_ids = await user_ids_reply.resource?.message?.awaitMessageComponent({
            componentType: ComponentType.UserSelect,
            time: 60_000,
        });
        log.trace(`Set report interface received ${JSON.stringify(user_ids?.values)}`);
        // await user_ids?.deferUpdate()
        await user_ids?.update({ components: [] });

        // await user_ids?.followUp({ content: "Rat" });
    },
};

export default reportMatch;
