import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configures Vite to compile the React app during local development and builds.
export default defineConfig({
  plugins: [react()],
})
