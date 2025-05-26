<template>
  <div
    class="review-sidebar"
    :style="{
      width: '360px',
      background: '#f0f4f8',
      padding: '20px',
      borderLeft: '1px solid #e5e7eb',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- ✅ AI 리뷰 요약 -->
    <div
      :style="{
        marginBottom: '16px',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }"
    >
      <h3 class="text-base font-semibold text-gray-800 mb-2">AI 리뷰 요약</h3>
      <p class="text-sm text-gray-600">
        {{ aiSummary || '리뷰 요약을 불러오는 중입니다...' }}
      </p>
    </div>

    <!-- ✅ 리뷰 목록 -->
    <div :style="{ flexGrow: 1, overflowY: 'auto', marginBottom: '16px' }">
      <div v-if="reviews.length === 0" class="text-center text-gray-500 text-sm">
        아직 작성된 리뷰가 없습니다.
      </div>
      <div v-for="review in reviews" :key="review.id" class="bg-white p-3 rounded mb-2 shadow-sm">
        <div class="text-sm font-medium text-gray-800 mb-1">{{ review.author }}</div>
        <div class="text-sm text-gray-700">{{ review.content }}</div>
      </div>
    </div>

    <!-- ✅ 댓글 입력 -->
    <div class="bg-white p-3 rounded shadow-sm">
      <textarea
        v-model="newComment"
        placeholder="리뷰를 입력하세요..."
        class="w-full p-2 border rounded text-sm"
        rows="3"
      ></textarea>
      <button
        @click="submitReview"
        class="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded text-sm"
      >
        등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

// Props
const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})

const reviews = ref([])
const aiSummary = ref('')
const newComment = ref('')

// 매물 ID 변경될 때마다 다시 불러오기
watch(
  () => props.propertyId,
  () => {
    fetchReviews()
    fetchSummary()
  },
)

onMounted(() => {
  fetchReviews()
  fetchSummary()
})

const fetchReviews = async () => {
  try {
    // API 연동 시 axios로 교체
    // const res = await axios.get(`/v1/reviews/${props.propertyId}`)
    // reviews.value = res.data.result
    reviews.value = [
      { id: 1, author: '철수', content: '주변이 조용해서 좋았어요.' },
      { id: 2, author: '영희', content: '교통은 살짝 불편하지만 만족해요.' },
    ]
  } catch (e) {
    reviews.value = []
    console.error('리뷰 불러오기 실패', e)
  }
}

const fetchSummary = async () => {
  try {
    // const res = await axios.get(`/v1/reviews/${props.propertyId}/summary`)
    // aiSummary.value = res.data.result
    aiSummary.value = '대체로 조용하고 생활 인프라가 잘 갖춰진 동네입니다.'
  } catch (e) {
    aiSummary.value = '요약 정보를 가져올 수 없습니다.'
  }
}

const submitReview = async () => {
  if (!newComment.value.trim()) return
  try {
    // await axios.post(`/v1/reviews/${props.propertyId}`, { content: newComment.value })
    reviews.value.push({
      id: Date.now(),
      author: '익명',
      content: newComment.value,
    })
    newComment.value = ''
  } catch (e) {
    console.error('리뷰 등록 실패', e)
  }
}
</script>
