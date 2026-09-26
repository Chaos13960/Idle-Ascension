import { defineConfig } from 'vitest/config'

// Test config is kept separate from vite.config.ts so the production build's
// type-check (tsc -b) never has to reconcile Vite 8 and Vitest's bundled Vite
// plugin types. The engine tests are pure logic and need no React plugin.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
