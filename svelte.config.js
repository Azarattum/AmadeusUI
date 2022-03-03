/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import preprocess from "svelte-preprocess";
import ctr from "@sveltejs/adapter-static";

import aspect from "postcss-aspect-ratio-polyfill";
import defineprops from "postcss-define-property";
import autoprefixer from "autoprefixer";
import importer from "postcss-import";
import inline from "postcss-base64";
import nested from "postcss-nested";
import nano from "cssnano";

const __dirname = dirname(fileURLToPath(import.meta.url));
const __base = process.env.AMADEUS_BASE || "";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [
        importer,
        defineprops,
        nested,
        autoprefixer,
        aspect,
        inline({ extensions: [".svg"], root: "./src/styles" }),
        nano,
      ],
    },
  }),

  kit: {
    adapter: ctr(),
    vite: () => ({
      resolve: {
        alias: {
          utils: resolve(__dirname, "./src/utils"),
          actions: resolve(__dirname, "./src/actions"),
          components: resolve(__dirname, "./src/components"),
          models: resolve(__dirname, "./src/models"),
        },
      },
    }),
    paths: {
      base: __base,
    },
  },
};

export default config;
