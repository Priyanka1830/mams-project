import { defineConfig } from 'vite'
import react from '@vitejs.plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['mams-project.onrender.com', '.onrender.com', 'all']
  }
})