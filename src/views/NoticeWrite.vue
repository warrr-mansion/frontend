<template>
  <div class="notice-write-wrapper">
    <div class="form-box">
      <h1 class="form-title">{{ isEditMode ? '공지사항 수정' : '공지사항 작성' }}</h1>
      <input v-model="title" type="text" placeholder="제목을 입력하세요" class="form-input" />
      <textarea v-model="content" placeholder="내용을 입력하세요" class="form-textarea"></textarea>
      <button @click="submitNotice" class="submit-btn">
        {{ isEditMode ? '수정' : '작성' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const route = useRoute()
const router = useRouter()

const isEditMode = route.query.mode === 'edit'
const id = route.query.id
const title = ref('')
const content = ref('')

onMounted(() => {
  if (isEditMode) {
    title.value = route.query.title || ''
    content.value = route.query.content || ''
  }
})

const submitNotice = async () => {
  try {
    const token = globalStore?.loginUser?.accessToken
    if (!token) {
      alert('토큰이 존재하지 않습니다. 다시 로그인해 주세요.')
      return
    }

    if (isEditMode) {
      if (!id) {
        alert('수정할 공지사항 ID가 없습니다.')
        return
      }

      await axios.put(
        `/v1/admin/notices/${id}`,
        {
          title: title.value,
          content: content.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      alert('공지사항이 수정되었습니다.')
    } else {
      await axios.post(
        `/v1/admin/notices`,
        {
          title: title.value,
          content: content.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      alert('공지사항이 등록되었습니다.')
    }

    router.push({ name: 'notice', query: { refresh: 'true' } })
  } catch (err) {
    console.error('공지사항 등록/수정 실패:', err)
    alert('요청 처리에 실패했습니다.')
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
