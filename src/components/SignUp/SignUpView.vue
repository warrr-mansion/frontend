<template>
  <div
    style="
      height: calc(100vh - 180px);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    "
  >
    <div
      style="
        background: white;
        padding: 40px;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
      "
    >
      <h1
        style="
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          text-align: center;
          margin-bottom: 24px;
        "
      >
        회원가입
      </h1>

      <form @submit.prevent="registMember">
        <div style="margin-bottom: 20px">
          <label
            for="nickname"
            style="display: block; font-size: 0.875rem; color: #4b5563; margin-bottom: 6px"
          >
            닉네임
          </label>
          <input
            id="nickname"
            v-model="member.nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            required
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              font-size: 0.9rem;
            "
          />
        </div>

        <div style="margin-bottom: 20px">
          <label
            for="email"
            style="display: block; font-size: 0.875rem; color: #4b5563; margin-bottom: 6px"
          >
            이메일
          </label>
          <input
            id="email"
            v-model="member.email"
            @input="handleEmailInput"
            type="email"
            placeholder="example@zipflex.com"
            required
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              font-size: 0.9rem;
            "
          />

          <!-- ✨ 이메일 형식 오류 메시지 -->
          <p v-if="emailError" style="margin-top: 4px; font-size: 0.75rem; color: #ef4444">
            유효한 이메일 형식을 입력해주세요.
          </p>

          <!-- ✨ 중복 확인 버튼 -->
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px">
            <button
              type="button"
              @click="checkEmail"
              style="
                flex-shrink: 0;
                padding: 6px 12px;
                background-color: #e5e7eb;
                border-radius: 4px;
                font-size: 0.8rem;
                border: none;
                cursor: pointer;
              "
            >
              중복 확인
            </button>

            <span
              v-if="isDuplicated"
              :style="{
                fontSize: '0.8rem',
                color: isDuplicated === 'true' ? '#ef4444' : '#10b981',
              }"
            >
              {{
                isDuplicated === 'true'
                  ? '이미 사용 중인 이메일입니다.'
                  : '사용 가능한 이메일입니다.'
              }}
            </span>
          </div>
        </div>

        <div style="margin-bottom: 20px">
          <label
            for="password"
            style="display: block; font-size: 0.875rem; color: #4b5563; margin-bottom: 6px"
          >
            비밀번호
          </label>
          <input
            id="password"
            v-model="member.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              font-size: 0.9rem;
            "
          />
        </div>

        <button
          type="submit"
          style="
            width: 100%;
            background-color: #6366f1;
            color: white;
            font-weight: 600;
            padding: 10px;
            border-radius: 4px;
            margin-top: 8px;
            transition: background-color 0.2s ease;
            border: none;
            cursor: pointer;
          "
        >
          회원가입
        </button>
      </form>

      <div style="margin-top: 20px; text-align: center; font-size: 0.875rem; color: #6b7280">
        이미 계정이 있으신가요?
        <router-link
          to="/login"
          style="color: #6366f1; text-decoration: none; font-weight: 500; margin-left: 6px"
        >
          로그인
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const error = ref('') // error 관리
const isDuplicated = ref('') // email 중복 관리
const emailError = ref(false)
const router = useRouter()
const member = ref({
  nickname: '',
  email: '',
  password: '',
}) // Member 관리

// 이메일 입력 시 호출되는 함수
const handleEmailInput = () => {
  isDuplicated.value = ''

  const email = member.value.email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = email && !emailPattern.test(email)
}

const registMember = async () => {
  error.value = ''

  if (isDuplicated.value !== 'false') {
    alert('이메일 중복 확인을 해주세요.')
    return
  }

  try {
    const res = await axios.post('/v1/auth/sign-up', member.value, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    alert('회원가입 성공!')
    router.push('/login')
  } catch (err) {
    console.error('회원가입 실패', err)
    error.value = err.response?.data?.message || '회원가입에 실패했습니다.'
  }
}

const checkEmail = async () => {
  isDuplicated.value = ''

  const email = member.value.email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    emailError.value = true
    alert('유효한 이메일 형식을 입력해주세요.')
    return
  }

  try {
    const res = await axios.get(`/v1/auth/check-email/${encodeURIComponent(email)}`)

    // ✅ 여기 수정
    isDuplicated.value = res.data.result.duplicated ? 'true' : 'false'
  } catch (err) {
    console.error('이메일 중복 확인 실패', err)
    isDuplicated.value = 'false'
  }
}
</script>
