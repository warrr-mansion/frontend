import { createApp, reactive } from 'vue'
import api from '@/api/axiosInstance'
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

const vuetify = createVuetify({ components, directives })
const app = createApp(App)

app.use(vuetify)
app.use(router)

// ✅ 전역 상태
const globalStatus = reactive({
  isLoggedIn: false,
  loginUser: {},
})
app.provide('globalStatus', globalStatus)

// ✅ Kakao Map SDK 로딩 함수
function loadKakaoMapSDK() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) return resolve(window.kakao)

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}
app.config.globalProperties.$loadKakaoMapSDK = loadKakaoMapSDK

// ✅ accessToken을 쿠키에서 읽음
const accessToken = getCookie('accessToken')
const refreshToken = getCookie('refreshToken')

// ✅ 사용자 정보 요청 함수
async function fetchUser() {
  try {
    const res = await axios.post('/v1/auth/sign-in', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    globalStatus.isLoggedIn = true
    globalStatus.loginUser = res.data.result
    console.log('✅ 자동 로그인 성공')
  } catch (err) {
    console.warn('❌ accessToken 만료 또는 오류:', err.response?.status)
    if (err.response?.status === 401 && refreshToken) {
      try {
        const reissueRes = await axios.post('/v1/auth/reissue', {
          refreshToken,
        })

        const newAccessToken = reissueRes.data.result.accessToken
        setCookie('accessToken', newAccessToken)
        console.log('♻️ accessToken 재발급 성공, 사용자 재요청')
        await fetchUser() // 재시도
      } catch (reissueErr) {
        console.error('🚫 재발급 실패:', reissueErr)
        logout()
      }
    } else {
      logout()
    }
  }
}

// ✅ 로그아웃 함수
function logout() {
  globalStatus.isLoggedIn = false
  globalStatus.loginUser = {}
  deleteCookie('accessToken')
  deleteCookie('refreshToken')
  localStorage.clear()
}

if (accessToken) {
  fetchUser()
}

app.mount('#app')
