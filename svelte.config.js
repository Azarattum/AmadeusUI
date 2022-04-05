import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import { resolve } from "path";

import aspect from "postcss-aspect-ratio-polyfill";
import property from "postcss-define-property";
import autoprefixer from "autoprefixer";
import importer from "postcss-import";
import inline from "postcss-base64";
import nested from "postcss-nested";
import nano from "cssnano";

const base = process.env.AMADEUS_BASE || "";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [
        importer,
        property,
        nested,
        autoprefixer,
        aspect,
        inline({ extensions: [".svg"], root: "./src/styles" }),
        nano,
      ],
    },
  }),

  kit: {
    prerender: { default: true },
    adapter: adapter(),
    paths: { base },
    vite: () => ({
      resolve: {
        alias: {
          utils: resolve("./src/app/utils"),
          models: resolve("./src/app/models"),
          actions: resolve("./src/app/actions"),
          components: resolve("./src/app/components"),

          $lib: resolve("./src/lib"),
          $utils: resolve("./src/lib/utils"),
          $models: resolve("./src/lib/models"),
          $actions: resolve("./src/lib/actions"),
          $components: resolve("./src/lib/components"),
        },
      },
    }),
  },
};

export default config;
