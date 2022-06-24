import { defineConfig } from "astro/config";

import turbolinks from "@astrojs/turbolinks";
import sitemap from "@astrojs/sitemap";
import shiki from "shiki";
import path from "node:path";
import { fileURLToPath } from "node:url";

const theme = await shiki.loadTheme(
  path.join(fileURLToPath(import.meta.url), "../code-theme.json")
);

// https://astro.build/config
export default defineConfig({
  integrations: [
    // turbolinks(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme,
      langs: [],
    },
  },
});
