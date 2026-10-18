// Build de una sola página (todo inline) solo para la vista previa compartible.
// No hace falta para correr el proyecto: usa `npm run dev` o `npm run build`.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-preview' },
})
