import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api/naver': {
        target: 'https://nid.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver/, ''),
        secure: false,
      },
      '/api/openapi': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openapi/, ''),
        secure: false
      },
      '/api/kakao': {
        target: 'https://kauth.kakao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kakao/, ''),
        secure: false,
      },
      '/api/kapi': {
        target: 'https://kapi.kakao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kapi/, ''),
        secure: false,
      },
      '/api': {
        target: 'https://gall.dcinside.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
