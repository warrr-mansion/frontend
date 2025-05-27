import axios from 'axios'
import { useGlobalStore } from '@/stores/global'
import api, { updateAccessToken, waitForTokenRefresh } from '@/api/axiosInstance'
import { setCookie } from '@/utils/cookie'

// ✅ 사용자 정보 요청 (토큰 재발급 대기 포함)
export async function getUserInfo() {
  await waitForTokenRefresh()

  try {
    const res = await api.get('/v1/members/me')
    return res.data
  } catch (err) {
    console.error('❌ getUserInfo 에러:', err?.response?.data?.message || err.message)
    return null
  }
}

// ✅ 로그인 요청
export async function signIn(email, password) {
  const res = await axios.post(
    '/v1/auth/sign-in',
    { email, password },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    },
  )

  const accessToken = res.headers['authorization']
  const refreshToken = res.headers['x-refresh-token']

  if (!accessToken || !refreshToken) {
    throw new Error('로그인에 실패했습니다.')
  }

  // ✅ 쿠키 + 전역 accessToken 모두 갱신
  updateAccessToken(accessToken)
  setCookie('refreshToken', refreshToken)

  const uuid = res.data.result.uuid
  const role = res.data.result.role

  if (uuid) {
    localStorage.setItem('memberUuid', uuid)
    localStorage.setItem('chatUuid', uuid)
  }

  return { uuid, role }
}

// ✅ 로그아웃
export function logout() {
  const globalStore = useGlobalStore()
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  globalStore.logout()

  localStorage.removeItem('memberUuid')
  localStorage.removeItem('chatUuid')
  const newChatUuid = crypto.randomUUID()
  localStorage.setItem('chatUuid', newChatUuid)
}
