<template>
  <div class="signup-wrapper">
    <div class="signup-box">
      <h1 class="signup-title">회원가입</h1>

      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>

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

        <button type="submit" class="signup-btn">회원가입</button>
      </form>

      <div class="signup-footer">
        이미 계정이 있으신가요?
        <router-link to="/login" class="link">로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nickname = ref('')
const email = ref('')
const password = ref('')

const signup = () => {
  // 실제 프로젝트에서는 여기서 서버와 통신
  console.log('회원가입 요청:', {
    nickname: nickname.value,
    email: email.value,
    password: password.value,
  })

  alert('회원가입 성공! (예시)')
  router.push('/login')
}
</script>

<style scoped>
.signup-wrapper {
  height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.signup-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.signup-title {
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

.signup-btn {
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

.signup-btn:hover {
  background-color: #4f46e5;
}

.signup-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  margin-left: 6px;
}

.link:hover {
  text-decoration: underline;
}
</style>
