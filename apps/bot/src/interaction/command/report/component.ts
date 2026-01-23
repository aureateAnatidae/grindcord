import type { ssbu_character_choices } from "@helper/SSBUCharacters";
import { getLogger } from "@logtape/logtape";
import {
    ButtonBuilder,
    ButtonStyle,
    Collection,
    type CommandInteraction,
    ComponentType,
    ContainerBuilder,
    type InteractionCallbackResponse,
    type Message,
    type MessageComponentInteraction,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    type User,
    UserSelectMenuBuilder,
} from "discord.js";

const log = getLogger(["bot", "component"]);

// TODO: export a types package from backend, share the type
type MatchPlayer = {
    user: User;
    win_count?: number | null;
    character?: Array<keyof typeof ssbu_character_choices> | null;
};

export async function initializeReportMatchInterface(interaction: CommandInteraction) {
    await selectUsersPage(interaction, new Collection<string, MatchPlayer>());
}

async function selectUsersPage(
    interaction: MessageComponentInteraction | CommandInteraction,
    match_players: Collection<string, MatchPlayer>,
) {
    const component = new ContainerBuilder()
        .addTextDisplayComponents((title) => title.setContent("# Report a Set"))
        .addActionRowComponents((actionRow) =>
            actionRow.setComponents(
                new UserSelectMenuBuilder()
                    .setCustomId("players")
                    .setPlaceholder("Who played in this set?")
                    .setMinValues(2)
                    .setMaxValues(4)
                    .setDefaultUsers(...match_players.keys()),
            ),
        )
        .addActionRowComponents((actionRow) =>
            actionRow.setComponents(
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Primary),
            ),
        );
    async function collect(message: Message<true>): Promise<void> {
        const selected_users = new Collection<string, MatchPlayer>(match_players);

        const userSelectCollector = message.createMessageComponentCollector({
            componentType: ComponentType.UserSelect,
            time: 60_000,
        });
        const pagingCollector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60_000,
        });

        userSelectCollector?.on("collect", async (i) => {
            selected_users.clear();
            for (const [user_id, user] of i.users) {
                selected_users.set(user_id, { user });
            }
            await i.deferUpdate();
        });
        pagingCollector?.on("collect", (i) => {
            log.trace(
                `collectUsers interface selected users: ${JSON.stringify([...selected_users.keys()])}`,
            );
            for (const [user_id, match_player] of selected_users) {
                if (!match_players.has(user_id)) {
                    match_players.set(user_id, match_player);
                }
            }
            match_players.sweep((_, user_id) => !selected_users.has(user_id));
            log.trace(
                `collectUsers interface has match_players: ${JSON.stringify([...match_players.keys()])}`,
            );

            userSelectCollector.stop();
            pagingCollector.stop();

            inputWinCountPage(i, match_players);
        });
    }
    const match_report_interactable = (await interaction.reply({
        components: [component],
        flags: MessageFlags.IsComponentsV2,
        withResponse: true,
    })) as InteractionCallbackResponse<true>;

    const message: Message<true> | undefined | null =
        match_report_interactable.resource?.message;
    if (!message) {
        throw new Error("Somehow, no message was attached to the reply");
    }
    collect(message);
}

async function inputWinCountPage(
    interaction: MessageComponentInteraction,
    match_players: Collection<string, MatchPlayer>,
) {
    const component = new ContainerBuilder().addTextDisplayComponents((title) =>
        title.setContent("# Report a Set"),
    );
    // console.log(match_players)
    for (const [user_id, match_player] of match_players) {
        console.log(user_id);
        component.addTextDisplayComponents((title) =>
            title.setContent(`<@${user_id}>`),
        );
        component.addActionRowComponents((actionRow) =>
            actionRow.addComponents(
                new StringSelectMenuBuilder()
                    .setPlaceholder(
                        `How many sets did ${match_player.user.username} win?`,
                    )
                    .setCustomId(user_id)
                    .setOptions(
                        [1, 2, 3, 4, 5, 6, 7].map((x) =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(x.toString())
                                .setValue(x.toString()),
                        ),
                    ),
            ),
        );
    }
    async function collect(interactable_message: Message<true>): Promise<void> {
        const winCountCollector = interactable_message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60_000,
        });
        const pagingCollector = interactable_message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60_000,
        });

        winCountCollector?.on("collect", (i) => {
            console.log(i);
            i.deferUpdate();
        });
        pagingCollector?.on("collect", (i) => {
            log.trace(`winCount interface received: ${JSON.stringify(i)}`);

            winCountCollector.stop();
            pagingCollector.stop();

            inputWinCountPage(i, match_players);
        });
    }
    const match_report_interactable = (await interaction.reply({
        components: [component],
        flags: MessageFlags.IsComponentsV2,
        withResponse: true,
        allowedMentions: {},
    })) as InteractionCallbackResponse<true>;

    const message: Message<true> | undefined | null =
        match_report_interactable.resource?.message;
    if (!message) {
        throw new Error("Somehow, no message was attached to the reply");
    }
    collect(message);
}
export const confirmReport = new ContainerBuilder().addTextDisplayComponents((title) =>
    title.setContent("## Please confirm the data to report"),
);
