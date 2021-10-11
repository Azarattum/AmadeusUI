/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import preprocess from "svelte-preprocess";
import ctr from "@sveltejs/adapter-static";
import autoprefixer from "autoprefixer";
import aspect from "postcss-aspect-ratio-polyfill";
import nested from "postcss-nested";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [nested, autoprefixer, aspect],
    },
  }),

  kit: {
    target: "body",
    adapter: ctr(),
    vite: () => ({
      resolve: {
        alias: {
          utils: resolve(__dirname, "./src/utils"),
          actions: resolve(__dirname, "./src/actions"),
          components: resolve(__dirname, "./src/components"),
        },
      },
    }),
  },
};

export default config;
