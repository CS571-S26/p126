import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/p126/",
  plugins: [react()],
  build: {
    outDir: "docs"
  },
  server: {
    proxy: {
      '/hadith-api': {
        target: 'https://hadithapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hadith-api/, ''),
      }
    }
  }
})