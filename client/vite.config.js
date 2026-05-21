import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  plugins: [react()],
})
