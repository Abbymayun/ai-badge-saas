import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/ai-badge-saas/',
  server: {
    proxy: {
      '/api/openai': {
        target: 'http://10.16.11.195',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, '/v1')
      },
      '/api/claude': {
        target: 'http://10.16.11.195',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, '')
      }
    }
  }
})