import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ✅ This is the key line to fix the blank page
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
