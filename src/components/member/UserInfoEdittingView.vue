<template>
  <div class="edit-wrapper">
    <div class="edit-box">
      <h1 class="edit-title">회원정보 수정</h1>

      <!-- 현재 비밀번호 확인 -->
      <div class="form-group">
        <label for="current-password">현재 비밀번호</label>
        <input
          id="current-password"
          v-model="currentPassword"
          type="password"
          placeholder="현재 비밀번호 입력"
          required
        />
        <button @click="checkPassword" class="edit-btn sub">비밀번호 확인</button>
        <p
          v-if="passwordCheckMessage"
          :class="['message', passwordCheckSuccess ? 'success' : 'error']"
        >
          {{ passwordCheckMessage }}
        </p>
      </div>

      <div v-if="passwordCheckSuccess">
        <!-- 닉네임 변경 -->
        <div class="form-group">
          <label for="nickname">새 닉네임</label>
          <input id="nickname" v-model="newNickname" type="text" placeholder="변경할 닉네임 입력" />
          <button @click="changeNickname" class="edit-btn sub">닉네임 변경</button>
          <p v-if="nicknameMessage" class="message info">{{ nicknameMessage }}</p>
        </div>

        <!-- 비밀번호 변경 -->
        <div class="form-group">
          <label for="new-password">새 비밀번호</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            placeholder="변경할 비밀번호 입력"
          />
          <button @click="changePassword" class="edit-btn sub yellow">비밀번호 변경</button>
          <p v-if="passwordMessage" class="message info">{{ passwordMessage }}</p>
        </div>

        <!-- 수정 완료 버튼 -->
        <div class="form-group" v-if="passwordCheckSuccess">
          <button @click="goToMain" class="edit-btn">수정 완료</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axiosInstance'

const currentPassword = ref('')
const newNickname = ref('')
const newPassword = ref('')

const passwordCheckSuccess = ref(false)
const passwordCheckMessage = ref('')
const nicknameMessage = ref('')
const passwordMessage = ref('')

const checkPassword = async () => {
  try {
    const res = await api.post('/v1/member/password-check', {
      currentPassword: currentPassword.value,
    })
    const matched = res.data?.result?.matched
    passwordCheckSuccess.value = !!matched
    passwordCheckMessage.value = matched
      ? '비밀번호가 일치합니다.'
      : '비밀번호가 일치하지 않습니다.'
  } catch (e) {
    passwordCheckSuccess.value = false
    passwordCheckMessage.value = '서버 오류가 발생했습니다.'
  }
}

const changeNickname = async () => {
  try {
    await api.patch('/v1/member/nickname', { nickname: newNickname.value })
    nicknameMessage.value = '닉네임이 성공적으로 변경되었습니다.'
  } catch (e) {
    nicknameMessage.value = '닉네임 변경 중 오류가 발생했습니다.'
  }
}

const changePassword = async () => {
  // ✅ 동일한 비밀번호 검사
  if (currentPassword.value === newPassword.value) {
    passwordMessage.value = '기존 비밀번호와 다른 비밀번호를 입력해주세요.'
    return
  }

  try {
    await api.patch('/v1/member/password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    passwordMessage.value = '비밀번호가 성공적으로 변경되었습니다.'
  } catch (e) {
    passwordMessage.value = '비밀번호 변경 중 오류가 발생했습니다.'
  }
}

import { useRouter } from 'vue-router'

const router = useRouter()

const goToMain = () => {
  router.push('/')
}
</script>

<style scoped>
.edit-wrapper {
  height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.edit-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.edit-title {
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

.edit-btn {
  width: 100%;
  background-color: #6366f1;
  color: white;
  font-weight: 600;
  padding: 10px;
  border-radius: 4px;
  margin-top: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-btn:hover {
  background-color: #4f46e5;
}

.edit-btn.sub {
  background-color: #10b981;
}

.edit-btn.sub:hover {
  background-color: #059669;
}

.edit-btn.sub.yellow {
  background-color: #facc15;
  color: black;
}

.edit-btn.sub.yellow:hover {
  background-color: #eab308;
}

.message {
  margin-top: 8px;
  font-size: 0.875rem;
}

.message.success {
  color: #16a34a;
}

.message.error {
  color: #dc2626;
}

.message.info {
  color: #2563eb;
}
</style>
