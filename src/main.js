import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import axios from 'axios'
import { getCookie, setCookie, deleteCookie } from '@/utils/cookie'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from 'pinia'
import { useGlobalStore } from '@/stores/global'

async function initApp() {
  const app = createApp(App)

  const pinia = createPinia()
  const vuetify = createVuetify({ components, directives })

  app.use(pinia)
  app.use(router)
  app.use(vuetify)

  const globalStore = useGlobalStore()

  // ✅ Kakao Map SDK 로딩 함수
  async function loadKakaoMapSDK() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        console.error('❌ Kakao SDK는 브라우저 환경에서만 동작합니다.')
        return reject(new Error('Not in browser'))
      }

      const jsKey = import.meta.env.VITE_KAKAO_JS_KEY
      if (!jsKey) {
        console.error('❌ Kakao JS 키가 정의되지 않았습니다.')
        return reject(new Error('Missing Kakao JS Key'))
      }

      if (window.kakao?.maps && typeof window.kakao.maps.load === 'function') {
        return resolve(window.kakao)
      }

      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false`
      script.async = true

      script.onload = () => {
        if (window.kakao?.maps?.load) {
          window.kakao.maps.load(() => resolve(window.kakao))
        } else {
          reject(new Error('Kakao SDK 로딩 실패'))
        }
      }

      script.onerror = (e) => {
        console.error('❌ Kakao Map SDK 로드 실패:', e)
        reject(e)
      }

      document.head.appendChild(script)
    })
  }

  // 전역으로 등록
  app.config.globalProperties.$loadKakaoMapSDK = loadKakaoMapSDK

  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')

  // 유효하지 않은 토큰 삭제
  if (!accessToken || accessToken === 'null' || accessToken === 'undefined') {
    console.log('❌ 유효하지 않은 accessToken 삭제')
    deleteCookie('accessToken')
  }

  async function fetchUser() {
    if (!accessToken || accessToken === 'null' || accessToken === 'undefined') {
      console.log('❌ 자동 로그인 실패: accessToken 없음')
      return
    }

    try {
      console.log('🔍 사용자 정보 조회 시작')
      const res = await axios.get('/v1/members/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const result = res.data.result
      globalStore.setUser({
        memberUuid: result.memberUuid,
        nickname: result.nickname,
        email: result.email,
        role: result.role,
        accessToken: accessToken,
      })
      console.log('✅ 자동 로그인 성공')
    } catch (err) {
      console.warn('❌ accessToken 오류:', err.response?.status)

      // 401 에러이고 refreshToken이 있는 경우 재발급 시도
      if (err.response?.status === 401 && refreshToken) {
        try {
          console.log('🔄 accessToken 만료, refreshToken으로 재발급 시도')
          const reissueRes = await axios.post('/v1/auth/reissue', { refreshToken })
          const newAccessToken = reissueRes.data.result.accessToken

          if (newAccessToken) {
            setCookie('accessToken', newAccessToken)
            console.log('♻️ accessToken 재발급 성공')

            // 재발급된 토큰으로 사용자 정보 다시 가져오기
            await fetchUser()
          } else {
            throw new Error('재발급된 토큰이 없습니다.')
          }
        } catch (e) {
          console.error('🚫 refreshToken 재발급 실패:', e.response?.data || e.message)
          console.log('🧹 토큰 삭제 및 로그아웃 처리')
          logout()
        }
      } else {
        console.log('🧹 accessToken 오류로 인한 로그아웃 처리')
        logout()
      }
    }
  }

  function logout() {
    console.log('🚪 로그아웃 처리 시작')
    globalStore.logout()

    // 모든 토큰 삭제
    deleteCookie('accessToken')
    deleteCookie('refreshToken')

    // localStorage도 정리
    localStorage.clear()

    console.log('✅ 로그아웃 완료 - 모든 토큰 삭제됨')
  }

  if (accessToken) {
    await fetchUser() // ✅ 사용자 정보가 세팅된 이후 mount
  }

  app.mount('#app') // ✅ 이제 사용자 정보가 있는 상태로 렌더링됨
}

initApp()
