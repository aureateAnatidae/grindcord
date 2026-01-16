import type { EventHandler } from "@event/types";
import { getLogger } from "@logtape/logtape";
import { type Client, Events } from "discord.js";

const log = getLogger(["bot"]);

const ClientReady: EventHandler = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client): void {
        log.info(
            `Commence startup on Events.ClientReady -- client ${client.user?.tag}`,
        );
    },
};

export default ClientReady;
