import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:autonomo` genera «Marian Portfolio.html»: un único archivo que se abre con doble clic.
export default defineConfig(({ mode }) => {
  const autonomo = mode === 'autonomo'
  return {
    plugins: [react(), ...(autonomo ? [viteSingleFile()] : [])],
    server: { port: 5193, strictPort: true },
    base: autonomo ? './' : '/',
    // Los prototipos no se meten en el archivo: se abren desde la carpeta public
    publicDir: autonomo ? false : 'public',
    build: autonomo ? { outDir: 'dist-autonomo', assetsInlineLimit: 100_000_000 } : undefined,
  }
})
