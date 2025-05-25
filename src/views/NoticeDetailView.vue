<template>
  <div class="notice-detail-wrapper">
    <div class="detail-box" v-if="notice">
      <h1 class="detail-title">{{ notice.title }}</h1>
      <p class="detail-date">{{ notice.date }}</p>
      <p class="detail-content">{{ notice.content }}</p>
    </div>
    <div v-else>
      <p>공지사항을 불러오는 중이거나 존재하지 않습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const notice = ref(null)
const id = route.params.id

const fetchNoticeDetail = async () => {
  try {
    const res = await axios.get(`/v1/notice/${id}`)
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
</style>
