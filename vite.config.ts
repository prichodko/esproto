/// <reference types="vitest" />
import { defineConfig } from 'vite'

import { dependencies } from './package.json'

const external = [
  ...Object.keys(dependencies || {}),
  // ...Object.keys(peerDependencies || {}),
]

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },

    target: 'modules',
    rollupOptions: {
      external: external.map((name) => new RegExp(`^${name}(/.*)?`)),
    },
  },

  test: {},
})
