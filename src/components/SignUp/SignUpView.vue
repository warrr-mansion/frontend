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
const canUse = ref('') // email 중복 관리
const router = useRouter()
const nickname = ref('')
const email = ref('')
const password = ref('')
const member = ref({
  nickname: '',
  email: '',
  password: '',
}) // Member 관리

const registMember = async () => {
  error.value = ''

  try {
    const res = await axios.post('/v1/auth/sign-up', member.value, {
      withCredentials: true, // 쿠키 사용 대비
      headers: {
        'Content-Type': 'application/json',
      },
    })

    alert('회원가입 성공!')
    router.push('/login') // 로그인 페이지로 이동
  } catch (err) {
    console.error('회원가입 실패', err)
    error.value = err.response?.data?.message || '회원가입에 실패했습니다.'
  }
}

const checkEmail = async () => {
  const arr = ['', 'true', 'false']
  canUse.value = arr[member.value.email?.length % 3]
  console.log(canUse.value)
}
</script>
