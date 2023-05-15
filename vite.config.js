import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // hack: `true; @import (reference) "${path.resolve("src/assets/css/base.less")}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://119.23.230.233/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
