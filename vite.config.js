import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: fileURLToPath(
        new URL('./src/quasar-variables.sass', import.meta.url)
      ),
    }),
  ],

  // 👇 muy importante para que las rutas de imágenes funcionen tras el build
  base: './',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // acceso directo a /src
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets', // asegura que las imágenes estén en /assets
  },
})
