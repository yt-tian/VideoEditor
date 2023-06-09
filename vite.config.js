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
    headers: {
      'Access-Control-Allow-Origin': 'http://119.23.230.233/,http://8.210.20.223/'
    },
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:3000',
        target: 'http://119.23.230.233/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/reptile_video': {
        target: 'http://119.23.230.233/',
        changeOrigin: true,
      },
      '/ai_api': {
        target: 'http://8.210.20.223/',
        changeOrigin: true,
        // onProxyRes(proxyRes,req,res){
        //   const realUrl = new URL(req.url || '','http://8.210.20.223/' || '')
        //   proxyRes.headers['x-real-url1'] = realUrl
        // },
        logLevel: 'debug'
      }
    }
  }
})
