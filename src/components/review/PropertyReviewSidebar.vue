<template>
  <div
    :style="{
      width: '360px',
      background: '#f9fafb',
      padding: '20px',
      borderLeft: '1px solid #e5e7eb',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- AI 요약 -->
    <div
      :style="{
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }"
    >
      <h3 :style="{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }">
        AI 리뷰 요약
      </h3>
      <p :style="{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }">
        {{ aiSummary || '리뷰 요약을 불러오는 중입니다...' }}
      </p>
    </div>

    <!-- 댓글 목록 -->
    <div :style="{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px' }">
      <div
        v-if="comments.length === 0"
        :style="{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '13px',
          padding: '40px 0',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
        }"
      >
        아직 작성된 리뷰가 없습니다.
      </div>

      <div
        v-for="comment in comments"
        :key="comment.commentId"
        :style="{
          backgroundColor: '#ffffff',
          padding: '14px 16px',
          borderRadius: '8px',
          marginBottom: '12px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        }"
      >
        <div :style="{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }">
          {{ comment.nickname }}
        </div>
        <div :style="{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }">
          {{ comment.content }}
        </div>
      </div>

      <!-- 더 보기 버튼 -->
      <div v-if="hasNext" :style="{ textAlign: 'center', marginTop: '16px' }">
        <button
          @click="loadNextPage"
          :style="{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease',
          }"
        >
          더 보기
        </button>
      </div>
    </div>

    <!-- 댓글 입력 -->
    <div
      :style="{
        backgroundColor: '#ffffff',
        padding: '14px 16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      }"
    >
      <textarea
        v-model="newComment"
        placeholder="리뷰를 입력하세요..."
        :style="{
          width: '100%',
          padding: '10px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '13px',
          lineHeight: '1.5',
          resize: 'none',
          outline: 'none',
        }"
        rows="3"
      ></textarea>
      <button
        @click="submitReview"
        :style="{
          marginTop: '10px',
          width: '100%',
          backgroundColor: '#6366f1',
          color: 'white',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }"
      >
        등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})

const comments = ref([])
const aiSummary = ref('')
const newComment = ref('')

// ✅ 누락되었던 변수 선언!
const pageNo = ref(1)
const pageSize = 5
const hasNext = ref(false)

const fetchComments = async () => {
  if (!props.propertyId) {
    console.warn('⚠️ fetchComments called without valid propertyId')
    return
  }
  try {
    console.log('📡 [댓글 요청 시작]', {
      propertyId: props.propertyId,
      pageNo: pageNo.value,
      pageSize: pageSize,
    })

    const res = await axios.get(`/v1/houses/${props.propertyId}/comments`, {
      params: {
        pageNo: pageNo.value,
        pageSize: pageSize,
      },
    })

    console.log('✅ [댓글 응답 수신]', res.data)

    const result = res.data.result

    if (!result || !Array.isArray(result.content)) {
      console.warn('⚠️ [댓글 응답 형식이 올바르지 않음]', result)
      return
    }

    if (pageNo.value === 1) {
      comments.value = result.content
      console.log('📄 [1페이지 댓글 갱신]', comments.value)
    } else {
      comments.value = [...comments.value, ...result.content]
      console.log('📄 [추가 댓글 누적]', comments.value)
    }

    hasNext.value = result.hasNext
    console.log('📌 [hasNext]', hasNext.value)
  } catch (err) {
    console.error('❌ 댓글 불러오기 실패:', err)
    console.error('❌ 상세:', err.response?.data || err.message)
    comments.value = []
  }
}

const loadNextPage = async () => {
  if (!hasNext.value) return
  pageNo.value++
  await fetchComments()
}

watch(
  () => props.propertyId,
  (newVal) => {
    if (!newVal) return
    console.log('👀 [watch] propertyId 변경됨:', newVal)
    pageNo.value = 1
    fetchComments()
  },
  { immediate: true },
)
</script>
