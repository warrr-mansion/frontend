<template>
  <div class="notice-wrapper">
    <div class="notice-box">
      <div class="notice-header">
        <h1 class="notice-title">📢 공지사항</h1>
        <button v-if="globalStatus.isLoggedIn" @click="goToWrite" class="write-btn">글쓰기</button>
      </div>

      <div class="notice-scroll-container">
        <ul class="notice-list">
          <li
            v-for="notice in notices"
            :key="notice.id"
            @click="goToDetail(notice.id)"
            class="notice-card"
          >
            <div class="card-content">
              <h2 class="card-title">{{ notice.title }}</h2>
              <p class="card-date">{{ notice.date }}</p>
            </div>
          </li>
        </ul>

        <div v-if="notices.length === 0" class="notice-empty">등록된 공지사항이 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const globalStatus = inject('globalStatus')
const router = useRouter()
const notices = ref([])
const loading = ref(true)

const fetchNotices = async () => {
  try {
    const res = await axios.get('/v1/notice')
    notices.value = res.data.result.map((notice) => ({
      id: notice.id,
      title: notice.title,
      date: notice.registDate?.slice(0, 10) || '날짜 없음',
    }))
  } catch (err) {
    console.error('공지사항 불러오기 실패:', err)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push({ name: 'NoticeDetail', params: { id } })
}

const goToWrite = () => {
  router.push({ name: 'NoticeWrite' })
}

onMounted(fetchNotices)
</script>

<style scoped>
.notice-wrapper {
  height: calc(100vh - 180px);
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.notice-box {
  width: 100%;
  max-width: 960px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.notice-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.notice-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
}

.write-btn {
  background-color: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.write-btn:hover {
  background-color: #059669;
}

.notice-scroll-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 260px); /* 헤더 포함한 실제 높이 조정 */
  padding: 24px;
  box-sizing: border-box;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-card {
  background: #fefefe;
  border: 1px solid #e5e7eb;

  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.notice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.card-date {
  font-size: 0.85rem;
  color: #6b7280;
}

.notice-empty {
  margin-top: 40px;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}
</style>
