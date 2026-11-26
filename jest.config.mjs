import nextJest from "next/jest.js";

const MINIMUM_COVERAGE = 80;

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.test.{ts,tsx}"],
  coverageThreshold: {
    global: {
      statements: MINIMUM_COVERAGE,
      branches: MINIMUM_COVERAGE,
      functions: MINIMUM_COVERAGE,
      lines: MINIMUM_COVERAGE,
    },
  },
};

export default createJestConfig(config);
