import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'

// 아래처럼 defineConfig 콜백에서 mode를 이용하여 환경변수 로드
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // 💡 세 번째 인자 '' 를 넣으면 VITE_ 없이도 가져올 수 있음

  return {
    plugins: [vue(), vueDevTools(), vuetify({ autoImport: true }), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/v1': {
          target: env.VITE_API_SERVER, // ✅ .env에 VITE_API_SERVER가 정의되어 있어야 함
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/v1/, '/v1'),
        },
      },
    },
  }
})
