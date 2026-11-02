/// <reference types="vitest/config" />
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/puzzles-web/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@e2e': path.resolve(import.meta.dirname, './e2e'),
      '@data': path.resolve(import.meta.dirname, './puzzles-data'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/*.test.ts'],
    testTimeout: 1000,
  },
})
