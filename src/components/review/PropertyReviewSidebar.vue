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
      position: 'relative',
    }"
  >
    <!-- 비회원 오버레이 -->
    <div
      v-if="!globalStore.isLoggedIn"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        borderRadius: '8px',
      }"
    >
      <div
        :style="{
          textAlign: 'center',
          maxWidth: '280px',
        }"
      >
        <div
          :style="{
            fontSize: '48px',
            marginBottom: '16px',
          }"
        >
          🔒
        </div>
        <h3
          :style="{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '12px',
          }"
        >
          로그인이 필요합니다
        </h3>
        <p
          :style="{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '24px',
          }"
        >
          회원가입 후 다양한 서비스를 이용해보세요
        </p>
        <div
          :style="{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }"
        >
          <button
            @click="goToLogin"
            :style="{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }"
          >
            로그인
          </button>
          <button
            @click="goToSignUp"
            :style="{
              backgroundColor: 'white',
              color: '#6366f1',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: '2px solid #6366f1',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>

    <!-- AI 요약 -->
    <div
      :style="{
        marginBottom: '16px',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        maxHeight: '300px',
        overflowY: 'auto',
      }"
    >
      <h3
        :style="{
          fontSize: '14px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }"
      >
        <span style="fontsize: '16px'">🤖</span>
        AI 리뷰 요약
      </h3>
      <div
        :style="{
          fontSize: '12px',
          color: '#4b5563',
          lineHeight: '1.6',
          whiteSpace: 'pre-line',
          backgroundColor: '#f8fafc',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }"
      >
        <div
          v-if="
            globalStore.isLoggedIn && aiSummary && aiSummary !== '리뷰 요약을 불러오는 중입니다...'
          "
        >
          <div
            v-for="(line, index) in aiSummary.split('\n')"
            :key="index"
            :style="{
              marginBottom:
                line.includes('😊') ||
                line.includes('📌') ||
                line.includes('👍') ||
                line.includes('👎') ||
                line.includes('🏷️')
                  ? '8px'
                  : '2px',
              padding:
                line.includes('😊') ||
                line.includes('📌') ||
                line.includes('👍') ||
                line.includes('👎') ||
                line.includes('🏷️')
                  ? '6px 8px'
                  : '0',
              backgroundColor: line.includes('😊')
                ? '#fef3c7'
                : line.includes('📌')
                  ? '#dbeafe'
                  : line.includes('👍')
                    ? '#dcfce7'
                    : line.includes('👎')
                      ? '#fee2e2'
                      : line.includes('🏷️')
                        ? '#f3e8ff'
                        : 'transparent',
              borderRadius:
                line.includes('😊') ||
                line.includes('📌') ||
                line.includes('👍') ||
                line.includes('👎') ||
                line.includes('🏷️')
                  ? '4px'
                  : '0',
              border: line.includes('😊')
                ? '1px solid #fbbf24'
                : line.includes('📌')
                  ? '1px solid #3b82f6'
                  : line.includes('👍')
                    ? '1px solid #10b981'
                    : line.includes('👎')
                      ? '1px solid #ef4444'
                      : line.includes('🏷️')
                        ? '1px solid #8b5cf6'
                        : 'none',
              fontWeight:
                line.includes('😊') ||
                line.includes('📌') ||
                line.includes('👍') ||
                line.includes('👎') ||
                line.includes('🏷️')
                  ? '600'
                  : '400',
            }"
          >
            {{ line }}
          </div>
        </div>
        <div v-else-if="!globalStore.isLoggedIn">
          <!-- 비회원용 가짜 AI 요약 -->
          <div
            :style="{
              marginBottom: '8px',
              padding: '6px 8px',
              backgroundColor: '#fef3c7',
              borderRadius: '4px',
              border: '1px solid #fbbf24',
              fontWeight: '600',
            }"
          >
            😊 전체적인 감정: 긍정적인 감정이 주를 이루고 있습니다.
          </div>
          <div
            :style="{
              marginBottom: '8px',
              padding: '6px 8px',
              backgroundColor: '#dbeafe',
              borderRadius: '4px',
              border: '1px solid #3b82f6',
              fontWeight: '600',
            }"
          >
            📌 주요 주제: 집의 편리함과 주차 문제
          </div>
          <div
            :style="{
              marginBottom: '8px',
              padding: '6px 8px',
              backgroundColor: '#dcfce7',
              borderRadius: '4px',
              border: '1px solid #10b981',
              fontWeight: '600',
            }"
          >
            👍 긍정적인 점: 집이 마음에 들고, 근처에 마트가 많아 편리함을 느끼고 있습니다.
          </div>
          <div
            :style="{
              marginBottom: '8px',
              padding: '6px 8px',
              backgroundColor: '#fee2e2',
              borderRadius: '4px',
              border: '1px solid #ef4444',
              fontWeight: '600',
            }"
          >
            👎 부정적인 점: 주차가 조금 불편하다는 점이 있습니다.
          </div>
          <div
            :style="{
              marginBottom: '2px',
              padding: '6px 8px',
              backgroundColor: '#f3e8ff',
              borderRadius: '4px',
              border: '1px solid #8b5cf6',
              fontWeight: '600',
            }"
          >
            🏷️ 핵심 키워드: 집, 편리함, 마트, 주차 문제
          </div>
        </div>
        <div
          v-else
          :style="{
            textAlign: 'center',
            color: '#6b7280',
            fontStyle: 'italic',
            padding: '16px',
          }"
        >
          {{ aiSummary || '리뷰 요약을 불러오는 중입니다...' }}
        </div>
      </div>
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
        <div style="display: flex; justify-content: space-between">
          <div style="font-weight: 600">{{ comment.nickname }}</div>
          <div v-if="isMyComment(comment)">
            <button @click="startEdit(comment)">✏️</button>
            <button @click="deleteComment(comment.commentId)">🗑️</button>
          </div>
        </div>
        <div v-if="editingCommentId === comment.commentId">
          <textarea v-model="editedContent" />
          <button @click="submitEdit(comment.commentId)">저장</button>
          <button @click="cancelEdit">취소</button>
        </div>
        <div v-else>
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
            fontWeight: '600',
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
          fontWeight: '600',
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
import { ref, watch, computed, onMounted } from 'vue'
import axios from 'axios'
import { useGlobalStore } from '@/stores/global'
import { getCookie } from '@/utils/cookie'
import { useRouter } from 'vue-router'

const globalStore = useGlobalStore()
const myUuid = computed(() => globalStore.loginUser?.uuid)
const isMyComment = (comment) => {
  return comment.memberUuid === myUuid.value
}

const router = useRouter()

const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})

const startEdit = (comment) => {
  editingCommentId.value = comment.commentId
  editedContent.value = comment.content
}
const cancelEdit = () => {
  editingCommentId.value = null
  editedContent.value = ''
}

const submitEdit = async (commentId) => {
  if (!editedContent.value.trim()) {
    alert('수정할 내용을 입력해주세요.')
    return
  }

  const token = getCookie('accessToken')
  if (!token) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    console.log('✏️ [댓글 수정 요청]', {
      commentId,
      content: editedContent.value,
    })

    await axios.patch(
      `/v1/auth/comments/${commentId}`,
      {
        content: editedContent.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    showToast('댓글이 수정되었습니다.')
    cancelEdit()
    await fetchComments()
  } catch (err) {
    console.error('❌ 댓글 수정 실패', err)
    showToast('댓글 수정에 실패했습니다.')
  }
}

const showToast = (message) => {
  alert(message) // 가장 단순한 대체
}

const submitReview = async () => {
  const token = getCookie('accessToken')
  if (!token) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    await axios.post(
      '/v1/auth/comments',
      {
        houseInfoId: props.propertyId,
        content: newComment.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    showToast('댓글이 등록되었습니다.')
    newComment.value = ''
    pageNo.value = 1
    await fetchComments()
  } catch (err) {
    console.error('❌ 댓글 작성 실패', err)
    showToast('댓글 등록에 실패했습니다.')
  }
}

const editingCommentId = ref(null)
const editedContent = ref('')

const comments = ref([])
const aiSummary = ref('')
const newComment = ref('')

const pageNo = ref(1)
const pageSize = 5
const hasNext = ref(false)

const fetchComments = async () => {
  console.log('🔍 [fetchComments 호출됨]')
  console.log('🧑‍💻 현재 로그인한 사용자 UUID:', myUuid.value)

  if (!props.propertyId) {
    console.warn('⚠️ [중단] propertyId가 유효하지 않음:', props.propertyId)
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

    console.log('✅ [댓글 응답 수신]', {
      status: res.status,
      isSuccess: res.data.isSuccess,
      result: res.data.result,
    })

    const result = res.data.result

    if (!result || !Array.isArray(result.content)) {
      console.warn('⚠️ [댓글 응답 형식 오류] content가 배열이 아님', result)
      return
    }

    if (pageNo.value === 1) {
      comments.value = result.content
      console.log('📄 [1페이지 댓글 갱신]', comments.value)

      // 첫 페이지 로드 시 댓글 수에 따라 AI 요약 처리
      if (result.pageSize === 0) {
        aiSummary.value =
          '죄송하지만 현재로서는 정확한 요약을 제공하기에 충분한 정보가 없습니다. 더 많은 피드백이 수집되면, 기꺼이 요약해 드리겠습니다.'
      } else {
        fetchAiSummary()
      }
    } else {
      comments.value = [...comments.value, ...result.content]
      console.log('📄 [추가 댓글 누적]', result.content)
    }

    hasNext.value = result.hasNext
    console.log('📌 [hasNext]', hasNext.value)
  } catch (err) {
    console.error('❌ [댓글 불러오기 실패]', {
      error: err,
      propertyId: props.propertyId,
      pageNo: pageNo.value,
    })
    console.error('❌ [에러 상세]', err.response?.data || err.message)
    comments.value = []
  }
}

const deleteComment = async (commentId) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return

  const token = getCookie('accessToken')
  if (!token) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    console.log('🗑️ [댓글 삭제 요청]', commentId)
    await axios.delete(`/v1/auth/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    showToast('댓글이 삭제되었습니다.')
    await fetchComments()
  } catch (err) {
    console.error('❌ 댓글 삭제 실패', err)
    showToast('댓글 삭제에 실패했습니다.')
  }
}

const loadNextPage = async () => {
  if (!hasNext.value) return
  pageNo.value++
  await fetchComments()
}

const fetchAiSummary = async () => {
  // 비회원이면 API 호출하지 않음
  if (!globalStore.isLoggedIn) {
    return
  }

  const token = getCookie('accessToken')
  if (!token) {
    console.warn('❌ 요약 요청 실패: 로그인 필요')
    return
  }

  try {
    console.log('🧠 [AI 요약 요청]', props.propertyId)
    const res = await axios.get(`/v1/houses/${props.propertyId}/comments/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('✅ AI 요약 응답:', res.data)

    if (res.data?.result) {
      aiSummary.value = res.data.result.summary || res.data.result
      console.log('✅ AI 요약 설정:', aiSummary.value)
    } else {
      console.warn('⚠️ AI 요약 응답 형식 이상:', res.data)
    }
  } catch (err) {
    console.error('❌ AI 요약 에러:', err.response?.data || err.message)
    aiSummary.value = '요약을 가져오는 중 오류가 발생했습니다.'
  }
}

// 로그인/회원가입 페이지 이동 함수
const goToLogin = () => {
  router.push('/login')
}

const goToSignUp = () => {
  router.push('/signup')
}

watch(
  () => globalStore.loginUser,
  (user) => {
    if (user && props.propertyId) {
      console.log('✅ [watch] 사용자 정보 로드 완료 후 fetchComments 실행')
      pageNo.value = 1
      fetchComments()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  if (!globalStore.loginUser) {
    try {
      const token = getCookie('accessToken')
      if (!token) return

      const res = await axios.get('/v1/members/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      globalStore.setUser(res.data.result)
      console.log('🎉 사용자 정보 불러옴:', res.data.result)
    } catch (err) {
      console.warn('❌ 사용자 정보 가져오기 실패:', err)
    }
  }
})
</script>
