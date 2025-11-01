import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['tests/**/*']
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli/index.ts'),
        react: resolve(__dirname, 'src/react.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format: string, entryName: string) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: [
        'commander',
        'dexie',
        'chalk',
        'fs-extra',
        'glob',
        'workbox-build',
        'workbox-sw',
        'react',
        'vue',
        'path',
        'fs',
        'url',
        'process'
      ]
    },
    target: 'node16',
    minify: false
  }
});