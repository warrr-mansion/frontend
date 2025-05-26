<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1 class="login-title">로그인</h1>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="example@zipflex.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button type="submit" class="login-btn">로그인</button>
      </form>

      <div class="login-footer">
        <router-link to="/signup" class="link">회원가입</router-link>
        <span class="divider">|</span>
        <router-link to="/forgot-password" class="link">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '@/api/auth.js'

const router = useRouter()
const email = ref('')
const password = ref('')

const globalStatus = inject('globalStatus')

if (!globalStatus) {
  throw new Error('globalStatus 주입 실패!')
}

const login = async () => {
  try {
    const user = await signIn(email.value, password.value)

    globalStatus.isLoggedIn = true
    globalStatus.loginUser = user

    router.push('/')
  } catch (err) {
    console.error('로그인 실패:', err)
    alert(err.message || '로그인에 실패했습니다.')
  }
}
</script>

<style scoped>
.login-wrapper {
  height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
}

.form-group input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.login-btn {
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
}

.login-btn:hover {
  background-color: #4f46e5;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.divider {
  margin: 0 8px;
  color: #9ca3af;
}
</style>
