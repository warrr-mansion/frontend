// src/api/axiosInstance.js
import axios from 'axios'
import { getCookie, setCookie } from '@/utils/cookie'
import { logout } from '@/api/auth'

const api = axios.create()

// ✅ 요청 인터셉터
api.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken')
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken.replace(/^Bearer\s*/, '')}`
  }
  return config
})

// ✅ 응답 인터셉터
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getCookie('refreshToken')
      if (!refreshToken) {
        logout()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const res = await axios.post('/v1/auth/reissue', {
          refreshToken: refreshToken,
        })

        const newAccessToken = res.headers['authorization']
        if (!newAccessToken) throw new Error('재발급 실패')

        setCookie('accessToken', newAccessToken)

        originalRequest.headers['Authorization'] =
          `Bearer ${newAccessToken.replace(/^Bearer\s*/, '')}`
        return api(originalRequest)
      } catch (e) {
        logout()
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  },
)

export default api
