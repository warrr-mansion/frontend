<template>
  <div
    style="
      height: calc(100vh - 180px);
      background-color: #f4f5f7;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    "
  >
    <div
      style="
        max-width: 960px;
        width: 100%;
        margin: 0 auto;
        padding: 40px 16px;
        flex: 1;
        overflow-y: auto;
        box-sizing: border-box;
      "
    >
      <h1
        style="
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 8px;
        "
      >
        📢 공지사항
      </h1>

      <!-- 제목 아래 버튼 추가 -->
      <div v-if="globalStatus.isLoggedIn" style="margin-bottom: 24px; text-align: right">
        <button @click="goToWrite" class="write-btn">글쓰기</button>
      </div>

      <ul style="display: flex; flex-direction: column; gap: 20px">
        <li
          v-for="notice in notices"
          :key="notice.id"
          @click="goToDetail(notice.id)"
          style="
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-left: 4px solid #6366f1;
            border-radius: 8px;
            padding: 20px;
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
            cursor: pointer;
          "
          @mouseover="
            (e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
            }
          "
          @mouseleave="
            (e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }
          "
        >
          <h2 style="font-size: 1.125rem; font-weight: 600; color: #111827">
            {{ notice.title }}
          </h2>
          <p style="font-size: 0.8rem; color: #9ca3af; margin-top: 4px">
            {{ notice.date }}
          </p>
        </li>
      </ul>

      <div
        v-if="notices.length === 0"
        style="margin-top: 40px; text-align: center; color: #9ca3af; font-style: italic"
      >
        등록된 공지사항이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const globalStatus = inject('globalStatus') // 전역 로그인 상태 주입
const goToWrite = () => router.push({ name: 'NoticeWrite' })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const notices = ref([])
const loading = ref(true)
const error = ref(null)

const fetchNotices = async () => {
  try {
    const res = await axios.get('/v1/notice')
    notices.value = res.data.result.map((notice) => {
      console.log('서버에서 받은 notice:', notice)
      return {
        id: notice.id,
        title: notice.title,
        date: notice.registDate?.slice(0, 10) || '날짜 없음',
        content: notice.content,
      }
    })
  } catch (err) {
    console.error('공지사항 불러오기 실패:', err)
    error.value = '공지사항을 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push({ name: 'NoticeDetail', params: { id } })
}

onMounted(fetchNotices)
</script>

<style scoped>
/* style scoped 내부에 추가 */
.write-btn {
  background-color: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.write-btn:hover {
  background-color: #059669;
}
</style>
