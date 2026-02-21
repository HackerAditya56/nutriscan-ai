import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['acd0-2401-4900-1ca8-5f71-c8d8-7ef0-84d7-f874.ngrok-free.app']
  }
})
