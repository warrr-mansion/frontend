import { createApp, reactive } from 'vue'
import App from './views/App.vue'
import router from './router'

// TODO: 01. bootstrap 관련 css와 js를 로딩하세요.
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// END

// TODO: 02-1. vuetify 관련 설정을 로딩하세요.
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})
// END

// TODO: 03-1. 카카오 관련 라이브러리를 로딩하세요.
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
// END

const app = createApp(App)

app.use(vuetify)
app.use(router)

// ✅ globalStatus를 반응형으로 생성하고 전역에 주입
const globalStatus = reactive({
  isLoggedIn: false,
  loginUser: {},
})
app.provide('globalStatus', globalStatus)

app.config.globalProperties.$loadKakaoMapSDK = loadKakaoMapSDK

app.mount('#app')
