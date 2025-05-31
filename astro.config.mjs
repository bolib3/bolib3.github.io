// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';
import publisher from './src/integrations/publisher';
import zipper from './src/integrations/zipper';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [vue(), publisher(), zipper()],
});
