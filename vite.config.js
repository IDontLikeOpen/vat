import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'sass:math'; @import "./src/assets/scss/utils";`,
      },
    },
  },
  base: '/',
  build: {
    outDir: '../web',
  },
});
