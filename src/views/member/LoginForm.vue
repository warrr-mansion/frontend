<template>
  <div class="container">
    <h1>login</h1>
    <form class="m-3" @submit.prevent="login">
      <div class="mb-3 row">
        <label for="email" class="col-sm-2 col-form-label">이메일</label>
        <div class="col-sm-10">
          <input
            type="email"
            id="email"
            v-model="member.email"
            placeholder="email 입력"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="mb-3 row">
        <label for="password" class="col-sm-2 col-form-label">비밀번호</label>
        <div class="col-sm-10">
          <input
            type="password"
            id="password"
            v-model="member.password"
            placeholder="비밀번호 입력"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center">
        <div class="form-check">
          <input type="checkbox" v-model="saveEmail" id="remember-me" class="form-check-input" />
          <label for="remember-me" class="form-check-label">로그인 유지</label>
        </div>
        <button type="submit" class="btn btn-primary ms-3">로그인</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useGlobalStore } from '@/stores/global' // ✅ Pinia 스토어 import

const router = useRouter()
const globalStore = useGlobalStore() // ✅ Pinia 인스턴스 생성

const member = ref({
  email: localStorage.getItem('email') || '',
  password: '',
})

const saveEmail = ref(member.value.email !== '')

const login = async () => {
  try {
    const res = await axios.post('/v1/auth/sign-in', member.value, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    })

    // 1. 응답 헤더에서 토큰 추출
    const accessToken = res.headers['authorization']
    const refreshToken = res.headers['x-refresh-token']

    if (!accessToken || !refreshToken) {
      alert('토큰이 없습니다. 관리자에게 문의하세요.')
      return
    }

    // 2. 쿠키에 수동 저장
    document.cookie = `accessToken=${accessToken}; path=/;`
    document.cookie = `refreshToken=${refreshToken}; path=/;`

    // 3. 이메일 저장 여부에 따라 localStorage 처리
    if (saveEmail.value) {
      localStorage.setItem('email', member.value.email)
    } else {
      localStorage.removeItem('email')
    }

    // 4. Pinia 전역 상태에 사용자 정보 저장
    globalStore.setUser({
      uuid: res.data.result.uuid,
      email: member.value.email,
      nickname: res.data.result.nickname, // 있으면 함께 저장
      role: res.data.result.role, // 있으면 함께 저장
      accessToken: accessToken, // 필요 시 사용
    })

    // 5. 로그인 여부 상태 설정
    globalStore.isLoggedIn = true

    // 6. 메인 페이지로 이동
    router.push('/')
  } catch (err) {
    console.error('로그인 실패', err)
    alert(err.response?.data?.message || '로그인에 실패했습니다.')
  }
}
</script>

<style scoped></style>
