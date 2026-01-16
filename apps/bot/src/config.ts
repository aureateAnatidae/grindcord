import { getLogLevels, isLogLevel } from "@logtape/logtape";
import { z } from "zod";

const programConfiguration = z.object({
    NODE_ENV: z.string(),

    APPLICATION_ID: z.string(),
    DISCORD_TOKEN: z.string(),

    LOG_LEVEL: z.literal(getLogLevels()),
});

const config = programConfiguration.parse({
    NODE_ENV: process.env.NODE_ENV,

    APPLICATION_ID: process.env.APPLICATION_ID,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,

    LOG_LEVEL:
        process.env.LOG_LEVEL && isLogLevel(process.env.LOG_LEVEL)
            ? process.env.LOG_LEVEL
            : process.env.NODE_ENV === "development"
              ? "debug"
              : "warning",
});

export default config;
