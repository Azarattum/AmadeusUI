/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import preprocess from "svelte-preprocess";
import ctr from "@sveltejs/adapter-static";
import autoprefixer from "autoprefixer";
import nested from "postcss-nested";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [nested, autoprefixer],
    },
  }),

  kit: {
    target: "body",
    adapter: ctr(),
    vite: () => ({
      resolve: {
        alias: {
          utils: resolve(__dirname, "./src/utils"),
          components: resolve(__dirname, "./src/components"),
        },
      },
    }),
  },
};

export default config;
