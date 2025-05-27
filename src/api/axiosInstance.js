import axios from 'axios'
import { getCookie, setCookie } from '@/utils/cookie'
import { useGlobalStore } from '@/stores/global'
import router from '@/router'

const api = axios.create()

// ✅ 전역 accessToken 변수
let currentAccessToken = getCookie('accessToken')
let isRefreshing = false
let refreshSubscribers = []

console.log('🧪 [INIT] currentAccessToken:', currentAccessToken)

// ✅ 요청 인터셉터: accessToken 설정
api.interceptors.request.use((config) => {
  console.log('📡 요청 인터셉터 진입. 현재 accessToken:', currentAccessToken)
  if (currentAccessToken) {
    config.headers['Authorization'] = `Bearer ${currentAccessToken.replace(/^Bearer\s*/, '')}`
  }
  return config
})

// ✅ 응답 인터셉터: 401 대응
api.interceptors.response.use(
  (res) => {
    const { code, message } = res.data || {}
    if (code === 401) {
      console.warn('⚠️ 응답 본문에 401 상태 감지 → 재발급 로직 진입 유도')
      const error = {
        message: message || '인증 오류',
        config: res.config,
        response: { status: 401, data: res.data },
      }
      return Promise.reject(error)
    }
    return res
  },

  async (error) => {
    const originalRequest = error.config

    // ✅ 토큰 만료 + 아직 재시도 안 한 요청만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            console.log('🧪 재발급 중 대기 중이던 요청 재시작 → token:', token)
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true

      const refreshToken = getCookie('refreshToken')
      if (!refreshToken) {
        console.warn('❌ 리프레시 토큰 없음 → 로그아웃')
        handleLogout()
        return Promise.reject(error)
      }

      try {
        console.log('🔄 재발급 요청 시작 → refreshToken:', refreshToken)
        const res = await axios.post('/v1/auth/reissue', { refreshToken })

        const newToken = res.headers['authorization']
        console.log('✅ 재발급 성공 → newToken:', newToken)

        updateAccessToken(newToken) // ✅ 전역 변수 + 쿠키 반영
        onRefreshed(newToken)

        console.log('🧪 [재시도 전] originalRequest:', originalRequest)
        console.log('🧪 [재시도 전] currentAccessToken:', currentAccessToken)

        return axios({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken.replace(/^Bearer\s*/, '')}`,
          },
        })
      } catch (e) {
        console.error('❌ 재발급 실패 → 로그아웃')
        handleLogout()
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

// ✅ accessToken 전역 반영 + 쿠키 저장
export function updateAccessToken(token) {
  currentAccessToken = token
  setCookie('accessToken', token)
  console.log('🧪 updateAccessToken() 호출 →', token)
}

// ✅ 재발급 기다리기 (외부에서 호출)
export async function waitForTokenRefresh() {
  if (!isRefreshing) return
  return new Promise((resolve) => {
    subscribeTokenRefresh(() => resolve())
  })
}

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

// ✅ 로그아웃 공통 처리
function handleLogout() {
  const store = useGlobalStore()
  store.logout()
  localStorage.clear()
  router.push('/login')
}

export default api
