import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const src_paths = {
    alias: {
        config: resolve(__dirname, "./src/config"),
        "@test": resolve(__dirname, "./src/test"),
        "@db": resolve(__dirname, "./src/db"),
        "@v1": resolve(__dirname, "./src/v1"),
    },
};

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    alias: src_paths.alias,
                    include: ["src/**/e2e.test.ts"],
                    name: { label: "e2e" },
                },
            },
            {
                test: {
                    alias: src_paths.alias,
                    include: ["src/**/integration.test.ts"],
                    name: { label: "integration" },
                },
            },
            {
                test: {
                    alias: src_paths.alias,
                    include: ["src/**/unit.test.ts"],
                    name: { label: "unit" },
                },
            },
            {
                test: {
                    include: ["dist/**/*.test.js"],
                    name: { label: "dist" },
                },
            },
        ],
    },
});
