import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, 'github-pages'),
  base: '/moss-and-cream-web-test/',
  publicDir: resolve(projectRoot, 'public'),
  css: { postcss: { plugins: [tailwindcss()] } },
  resolve: {
    alias: {
      'next/image': resolve(projectRoot, 'github-pages/NextImage.tsx'),
    },
  },
  plugins: [react()],
  build: {
    outDir: resolve(projectRoot, 'dist-pages'),
    emptyOutDir: true,
  },
});
