import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const src_paths = {
    alias: {
        "@seeds": resolve(__dirname, "./seeds"),
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
                    typecheck: {
                        include: ["src/**/*"],
                        enabled: true,
                    },
                    name: { label: "e2e" },
                },
            },
            {
                test: {
                    alias: src_paths.alias,
                    include: ["src/**/integration.test.ts"],
                    typecheck: {
                        include: ["src/**/*"],
                        enabled: true,
                    },
                    name: { label: "integration" },
                },
            },
            {
                test: {
                    alias: src_paths.alias,
                    include: ["src/**/unit.test.ts"],
                    typecheck: {
                        include: ["src/**/*"],
                        enabled: true,
                    },
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
