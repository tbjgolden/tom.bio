import { defineConfig } from "astro/config";

import turbolinks from "@astrojs/turbolinks";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [turbolinks(), sitemap()],
});
