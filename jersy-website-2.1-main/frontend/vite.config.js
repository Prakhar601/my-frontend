import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true, // This enables listening on all network interfaces
    strictPort: false // This allows fallback to another port if 5173 is taken
  }
})

