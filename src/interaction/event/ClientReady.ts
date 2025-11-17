import { Events } from "discord.js";
import pino from "pino";

const log = pino();

const ClientReady = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        log.info(`Commence startup on Events.ClientReady -- client ${client.user.tag}`);
        // TODO: Implement parsing all messages since last message parsed
    },
};

export default ClientReady;
