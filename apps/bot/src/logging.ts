import { configure, getConsoleSink } from "@logtape/logtape";
import config from "config";

export async function logConfigure() {
    await configure({
        sinks: { console: getConsoleSink() },
        loggers: [
            { category: ["bot"], sinks: ["console"], lowestLevel: config.LOG_LEVEL },
        ],
    });
}
