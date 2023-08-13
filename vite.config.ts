import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  // for the production build, enable this
  //define: {
  // +   'import.meta.vitest': 'undefined',
  // + },
  test: {
    environment: "jsdom",
    globals: true,
    includeSource: ["src/**/*.ts", "src/**/*.tsx"],
    deps: {
      optimizer: {
        web: {
          include: ["src/**/*.ts", "src/**/*.tsx"]
        }
      }
    }
  }
});
