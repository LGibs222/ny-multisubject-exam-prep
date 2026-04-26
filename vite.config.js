import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works both at a subpath (GitHub Pages
  // serves /ny-multisubject-exam-prep/) and at root (Netlify previews).
  base: './',
})
