import axios from 'axios'

// ✅ 쿠키 저장 함수
export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`
  console.log(`✅ ${name} 쿠키 저장됨 →`, document.cookie)
}

// ✅ 쿠키 삭제 함수
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
}

// 로그인 요청
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

  console.log('✅ accessToken:', accessToken)
  console.log('✅ 쿠키 저장 전 document.cookie:', document.cookie)

  if (!accessToken || !refreshToken) {
    throw new Error('로그인에 실패했습니다.')
  }

  // ✅ 쿠키에 저장
  setCookie('accessToken', accessToken)
  setCookie('refreshToken', refreshToken)

  console.log('✅ 쿠키 저장 후 document.cookie:', document.cookie)

  // ✅ UUID 저장 (chatUuid & memberUuid 모두)
  const uuid = res.data.result.uuid
  if (uuid) {
    localStorage.setItem('memberUuid', uuid)
    localStorage.setItem('chatUuid', uuid)
  }

  return res.data.result // 사용자 정보 반환
}

// 로그아웃
export function logout(globalStatus, router) {
  // 1. 쿠키 삭제
  deleteCookie('accessToken')
  deleteCookie('refreshToken')

  // 2. 상태 초기화
  globalStatus.isLoggedIn = false
  globalStatus.loginUser = {}

  // 3. UUID 초기화
  localStorage.removeItem('memberUuid')
  localStorage.removeItem('chatUuid')

  // ✅ 비회원용 chatUuid 새로 생성하여 저장
  const newChatUuid = crypto.randomUUID()
  localStorage.setItem('chatUuid', newChatUuid)

  // 4. 메인페이지로 이동
  router.push('/')
}
