import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import preact from "@astrojs/preact";
import shiki from "shiki";
import path from "node:path";
import { fileURLToPath } from "node:url";

const theme = await shiki.loadTheme(
  path.join(fileURLToPath(import.meta.url), "../code-theme.json")
);

// https://astro.build/config
export default defineConfig({
  base: "",
  integrations: [preact(), sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme,
      langs: [],
    },
  },
});
