import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      include: ["src/logic/**/*.js", "src/permissions.js"],
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
  },
});
