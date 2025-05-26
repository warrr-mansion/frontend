import { createApp, reactive } from 'vue'
import api from '@/api/axiosInstance'
import App from './views/App.vue'
import router from './router'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { getCookie } from '@/utils/cookie'

const vuetify = createVuetify({
  components,
  directives,
})

function loadKakaoMapSDK() {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao)
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao)
      })
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const app = createApp(App)

app.use(vuetify)
app.use(router)

// ✅ globalStatus를 반응형으로 생성하고 전역에 주입
const globalStatus = reactive({
  isLoggedIn: false,
  loginUser: {},
})
app.provide('globalStatus', globalStatus)

// ✅ accessToken이 있으면 사용자 정보 요청 시도
const token = localStorage.getItem('accessToken')
if (token) {
  try {
    const res = await axios.get('/v1/member', {
      headers: { Authorization: token },
    })

    globalStatus.isLoggedIn = true
    globalStatus.loginUser = res.data.result
  } catch (err) {
    console.warn('자동 로그인 실패:', err)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

const accessToken = getCookie('accessToken')
console.log('🚀 accessToken from cookie:', accessToken)
if (accessToken) {
  axios
    .get('/v1/member', {
      headers: {
        Authorization: `Bearer ${accessToken.replace(/^Bearer\s*/, '')}`, // ✅ Bearer 중복 방지
      },
    })
    .then((res) => {
      console.log('✅ 자동 로그인 성공')
      globalStatus.isLoggedIn = true
      globalStatus.loginUser = res.data.result
    })
    .catch((err) => {
      console.warn('❌ 자동 로그인 실패:', err)
      globalStatus.isLoggedIn = false
      globalStatus.loginUser = {}
    })
}

// 요청 인터셉터 (기본 Authorization 자동 추가)
if (accessToken) {
  api
    .get('/v1/member')
    .then((res) => {
      globalStatus.isLoggedIn = true
      globalStatus.loginUser = res.data.result
    })
    .catch((err) => {
      console.warn('❌ 자동 로그인 실패:', err)
    })
}

app.config.globalProperties.$loadKakaoMapSDK = loadKakaoMapSDK

app.mount('#app')
