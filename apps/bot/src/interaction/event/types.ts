import type { Events } from "discord.js";

export type EventHandler = {
    name: Events;
    once: boolean;
    execute(...args: any): Promise<void> | void;
};
