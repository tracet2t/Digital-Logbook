import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  transform: {
    "\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.config.testing.js" }],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  modulePathIgnorePatterns: ["<rootDir>/.next/"],
};

export default config;
