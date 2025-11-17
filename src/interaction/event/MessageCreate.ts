import { Events, type GuildMember, type Message } from "discord.js";
import pino from "pino";

const log = pino();

const MessageCreate = {
    name: Events.MessageCreate,
    async execute(message: Message) {},
};

export default MessageCreate;
