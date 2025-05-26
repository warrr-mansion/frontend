<template>
  <div>
    <!-- 플로팅 버튼 -->
    <div class="fixed bottom-6 right-6 z-50">
      <button @click="show = !show" class="bg-purple-800 p-1 rounded-full shadow-xl">
        <img src="../assets/img/chatbot_icon.png" alt="챗봇 아이콘" class="w-14 h-14" />
      </button>
    </div>

    <!-- 챗봇 창 -->
    <div
      v-if="show"
      class="fixed bottom-20 right-6 w-[350px] h-[500px] bg-white shadow-xl rounded-xl flex flex-col z-[99999]"
    >
      <!-- 상단 헤더 -->
      <div class="bg-purple-700 text-white p-3 flex justify-between items-center">
        <span>부동산 챗봇</span>
        <button @click="show = false">✖</button>
      </div>

      <!-- 채팅 내용 영역 -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50" ref="chatContainer">
        <div v-for="(msg, i) in messages" :key="i">
          <div
            v-if="msg.role === 'user'"
            class="text-right text-sm text-black bg-gray-200 p-2 rounded-md inline-block max-w-[80%] ml-auto"
          >
            {{ msg.content }}
          </div>
          <div
            v-else
            class="text-left text-sm text-white bg-purple-500 p-2 rounded-md inline-block max-w-[80%]"
          >
            {{ msg.content }}
          </div>
        </div>

        <!-- 로딩 중 메시지 -->
        <div v-if="loading" class="text-left text-sm text-gray-500 italic">
          챗봇이 타이핑 중입니다...
        </div>
      </div>

      <!-- 입력창 -->
      <div class="p-3 border-t flex items-center gap-2">
        <input
          v-model="input"
          @keydown.enter="send"
          class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="무엇이든 물어보세요..."
          :disabled="loading"
        />
        <button
          @click="send"
          :disabled="loading"
          class="bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import axios from 'axios'

const show = ref(false)
const input = ref('')
const messages = ref([{ role: 'assistant', content: '안녕하세요! 부동산 관련 질문을 해보세요 😊' }])
const loading = ref(false)

// UUID 저장용 ref
const chatUuid = ref('')

// UUID 생성 함수 (36자)
function generateRandom36Char() {
  return crypto.randomUUID()
}

// UUID 초기화 함수
function initializeChatUuid() {
  const memberUuid = localStorage.getItem('memberUuid')

  if (memberUuid) {
    chatUuid.value = memberUuid
  } else {
    let storedChatUuid = localStorage.getItem('chatUuid')
    if (!storedChatUuid) {
      storedChatUuid = generateRandom36Char()
      localStorage.setItem('chatUuid', storedChatUuid)
    }
    chatUuid.value = storedChatUuid
  }
}

// ✅ 호출 위치 추가!
onMounted(() => {
  initializeChatUuid()
})

// 스크롤 하단 고정
const chatContainer = ref(null)
watch(messages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})

const send = async () => {
  const text = input.value.trim()
  if (!text) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true

  try {
    const res = await axios.post('/v1/chatbot', {
      chatUuid: chatUuid.value,
      message: text,
    })

    const answer = res.data?.result?.content
    if (answer) {
      messages.value.push({ role: 'assistant', content: answer })
    } else {
      messages.value.push({ role: 'assistant', content: '❗ 서버로부터 유효한 응답이 없습니다.' })
    }
  } catch (err) {
    console.error('❌ [요청 실패]', err)
    messages.value.push({
      role: 'assistant',
      content: '❗ 오류가 발생했습니다. 콘솔 로그를 확인해주세요.',
    })
  } finally {
    loading.value = false
  }
}
</script>
