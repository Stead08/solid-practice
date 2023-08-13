import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  // for the production build, enable this
  //define: {
  // +   'import.meta.vitest': 'undefined',
  // + },
  test: {
    environment: "jsdom",
    globals: true,
    includeSource: ["src/**/*.ts", "src/**/*.tsx"]
  }
});
