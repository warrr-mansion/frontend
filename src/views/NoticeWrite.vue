<template>
  <div class="notice-write-wrapper">
    <div class="form-box">
      <h1 class="form-title">공지사항 작성</h1>
      <input v-model="title" type="text" placeholder="제목을 입력하세요" class="form-input" />
      <textarea v-model="content" placeholder="내용을 입력하세요" class="form-textarea"></textarea>
      <button @click="submitNotice" class="submit-btn">작성</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const title = ref('')
const content = ref('')
const router = useRouter()

const submitNotice = async () => {
  try {
    console.log('요청 URL 확인', import.meta.env.VITE_API_URL)
    await axios.post('/v1/notice', {
      title: title.value,
      content: content.value,
    })
    alert('공지사항이 등록되었습니다.')
    router.push({ name: 'notice' })
  } catch (err) {
    console.error('공지사항 등록 실패:', err)
    alert('공지사항 등록에 실패했습니다.')
  }
}
</script>

<style scoped>
.notice-write-wrapper {
  padding: 40px;
  background-color: #f9fafb;
  min-height: calc(100vh - 180px);
}
.form-box {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}
.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
.form-textarea {
  min-height: 200px;
  resize: vertical;
}
.submit-btn {
  background-color: #6366f1;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #4f46e5;
}
</style>
