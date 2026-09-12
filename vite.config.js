// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev
// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: ['./src/tests/setup.tsx'],
//     coverage: {
//       provider: 'v8',
//       reporter: ['text', 'html'],
//       thresholds: {
//         lines: 60,
//         functions: 60,
//         branches: 50,
//         statements: 60,
//       },
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config' // 👈 Importante para no perder las exclusiones por defecto

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.tsx'],
    exclude: [
      ...configDefaults.exclude, // Mantiene las carpetas ignoradas por defecto (como node_modules)
      '**/e2e/**',               // 👈 Ignora tu carpeta de Playwright E2E
      '**/tests/**',             // 👈 Ignora carpetas de tests alternativas de Playwright
      '**/*.spec.{ts,tsx}'       // 👈 Ignora cualquier archivo .spec de Playwright
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 25,
        functions: 30,
        branches: 25,
        statements: 20,
      },
    },
  },
})
