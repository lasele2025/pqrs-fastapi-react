import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',  // Fija el host en localhost
    port: 5173,         // Fija el puerto en 5173 (o el que prefieras)
    strictPort: true,   // Hace que falle si el puerto está ocupado, no busque otro
  }
})
