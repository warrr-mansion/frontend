<template>
  <div class="notice-detail-wrapper">
    <div class="detail-box" v-if="notice">
      <h1 class="detail-title">{{ notice.title }}</h1>
      <p class="detail-date">{{ notice.date }}</p>
      <p class="detail-content">{{ notice.content }}</p>

      <!-- ✅ 관리자일 경우에만 수정/삭제 버튼 노출 -->
      <div v-if="isAdmin" class="action-buttons">
        <button class="edit-btn" @click="goToEdit">수정</button>
        <button class="delete-btn" @click="deleteNotice">삭제</button>
      </div>
    </div>
    <div v-else>
      <p>공지사항을 불러오는 중이거나 존재하지 않습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useGlobalStore } from '@/stores/global' // ✅ Pinia store import
import { getCookie } from '@/utils/cookie'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore() // ✅ Pinia store instance

const notice = ref(null)
const id = route.params.id

// ✅ 관리자 여부 판별 (Pinia 기반)
const isAdmin = computed(() => globalStore.isLoggedIn && globalStore.loginUser?.role === 'ADMIN')

const fetchNoticeDetail = async () => {
  try {
    const res = await axios.get(`/v1/notices/${id}`)
    const data = res.data.result
    notice.value = {
      id: data.id,
      title: data.title,
      content: data.content,
      date: data.registDate?.slice(0, 10) || '',
    }
  } catch (err) {
    console.error('공지사항 상세 조회 실패:', err)
    notice.value = null
  }
}

const goToEdit = () => {
  router.push({
    name: 'NoticeWrite',
    query: {
      mode: 'edit',
      id: notice.value.id,
      title: notice.value.title,
      content: notice.value.content,
    },
  })
}

const deleteNotice = async () => {
  if (!confirm('정말로 삭제하시겠습니까?')) return

  const token = getCookie('accessToken')
  if (!token) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    await axios.delete(`/v1/admin/notices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    alert('공지사항이 삭제되었습니다.')
    console.log('🗑️ 삭제 요청 ID:', id)
    router.push({ name: 'notice' })
  } catch (err) {
    console.error('삭제 실패:', err)
    alert('공지사항 삭제에 실패했습니다.')
  }
}

onMounted(fetchNoticeDetail)
</script>

<style scoped>
.notice-detail-wrapper {
  height: calc(100vh - 180px);
  background-color: #f4f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
}
.detail-box {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.detail-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #111827;
}
.detail-date {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 24px;
}
.detail-content {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-line;
}
.action-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.edit-btn,
.delete-btn {
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.edit-btn {
  background-color: #3b82f6;
  color: white;
}
.edit-btn:hover {
  background-color: #2563eb;
}
.delete-btn {
  background-color: #ef4444;
  color: white;
}
.delete-btn:hover {
  background-color: #dc2626;
}
</style>
