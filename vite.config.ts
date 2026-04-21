import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // BASE_PATH wins when set (flexible for any repo name / custom domain).
  // GITHUB_PAGES preserved for backward compat with the original mackdanny deploy.
  base: process.env.BASE_PATH ?? (process.env.GITHUB_PAGES ? '/rosebud-cloud-solutions/' : '/'),
  plugins: [react(), tailwindcss(), vike()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
