<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- 사용자 영역 -->
    <div
      class="relative bg-cover bg-center h-[306px] text-white flex items-center"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-800 opacity-70 z-0"
      ></div>
      <div class="relative z-10 max-w-5xl mx-auto px-6 flex justify-between items-center w-full">
        <div class="flex items-center gap-6">
          <div
            class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-500 text-4xl"
          >
            👤
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ nickname }} 님</h2>
            <p class="text-base">email : {{ email }}</p>
          </div>
        </div>
        <router-link
          to="/userInfoEdit"
          class="bg-white text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-200 no-underline"
        >
          회원정보 수정
        </router-link>
      </div>
    </div>

    <!-- 메인 콘텐츠 박스 -->
    <div class="max-w-5xl mx-auto bg-gray-200 mt-8 px-8 py-6">
      <!-- 탭 메뉴 -->
      <div class="flex gap-6 text-gray-600 font-semibold mb-4 border-b border-gray-600 pb-2">
        <div
          :class="[
            activeTab === '찜한 매물' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="activeTab = '찜한 매물'"
        >
          찜한 매물
        </div>
        <div
          :class="[
            activeTab === '최근 본 매물' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="activeTab = '최근 본 매물'"
        >
          최근 본 매물
        </div>
        <div
          :class="[
            activeTab === '관심지역' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="activeTab = '관심지역'"
        >
          관심지역
        </div>
        <div
          :class="[
            activeTab === '관심지역 설정' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="activeTab = '관심지역 설정'"
        >
          관심지역 설정
        </div>
      </div>

      <!-- 콘텐츠 영역 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- 찜한 매물 -->
        <template v-if="activeTab === '찜한 매물'">
          <div v-for="n in 3" :key="'like' + n" class="bg-white shadow rounded overflow-hidden">
            <div class="bg-gray-300 h-48"></div>
            <div class="bg-gray-400 text-white p-4">
              <div class="font-bold text-lg mb-1">매매 100억</div>
              <div class="text-sm">아파트</div>
              <div class="text-sm">서울특별시 강남구</div>
              <div class="text-sm">671.45㎡ / 248.6㎡</div>
            </div>
          </div>
        </template>

        <!-- 최근 본 매물 -->
        <template v-else-if="activeTab === '최근 본 매물'">
          <div v-for="n in 3" :key="'recent' + n" class="bg-white shadow rounded overflow-hidden">
            <div class="bg-gray-200 h-48"></div>
            <div class="bg-gray-500 text-white p-4">
              <div class="font-bold text-lg mb-1">매매 80억</div>
              <div class="text-sm">오피스텔</div>
              <div class="text-sm">서울특별시 서초구</div>
              <div class="text-sm">82.21㎡ / 30.0㎡</div>
            </div>
          </div>
        </template>

        <!-- 관심지역 -->
        <template v-else-if="activeTab === '관심지역'">
          <div class="col-span-full bg-white p-6 rounded shadow">
            <h3 class="text-lg font-semibold mb-2">등록된 관심지역</h3>
            <p class="text-gray-700">서울특별시 강남구, 경기 성남시 분당구</p>
          </div>
        </template>

        <!-- 관심지역 설정 -->
        <template v-else-if="activeTab === '관심지역 설정'">
          <div class="col-span-full bg-white p-6 rounded shadow">
            <h3 class="text-lg font-semibold mb-4">관심지역 설정</h3>
            <!-- 여기에 관심지역 선택 컴포넌트 삽입 -->
            <FavoriteRegionSelector
              :buildingType="buildingType"
              :sido="sido"
              :gugun="gugun"
              :dong="dong"
              :sidoList="sidoList"
              :gugunList="gugunList"
              :dongList="dongList"
              :loading="loading"
              @update:buildingType="(val) => (buildingType = val)"
              @update:sido="(val) => (sido = val)"
              @update:gugun="(val) => (gugun = val)"
              @update:dong="(val) => (dong = val)"
              @add="addFavoriteRegion"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import axios from 'axios'
import backgroundUrl from '@/assets/img/mainbackground.jpg'
import FavoriteRegionSelector from '../region/FavoriteRegionSelector.vue'

// ✅ 전역 상태 불러오기
const globalStatus = inject('globalStatus')

// ✅ 사용자 정보 상태
const nickname = ref('')
const email = ref('')
const activeTab = ref('찜한 매물')

// ✅ 쿠키에서 accessToken 추출하는 유틸
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const buildingType = ref('')
const sido = ref('')
const gugun = ref('')
const dong = ref('')
const loading = ref(false)

// ✅ 컴포넌트 마운트 시 사용자 정보 조회
onMounted(async () => {
  try {
    const accessToken = getCookie('accessToken')
    if (!accessToken) {
      console.warn('accessToken이 없습니다.')
      return
    }

    const res = await axios.get('/v1/members/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const result = res.data.result
    nickname.value = result.nickname
    email.value = result.email

    // ✅ 전역 상태 업데이트
    if (globalStatus) {
      globalStatus.isLoggedIn = true
      globalStatus.loginUser = {
        uuid: result.memberUuid,
        nickname: result.nickname,
        email: result.email,
        role: result.role,
      }
    }
  } catch (err) {
    console.error('회원 정보 불러오기 실패:', err)
  }
})

const addFavoriteRegion = async () => {
  loading.value = true
  try {
    console.log('📦 관심지역 추가 요청:', {
      buildingType: buildingType.value,
      sido: sido.value,
      gugun: gugun.value,
      dong: dong.value,
    })
    // 나중에 API 연결될 위치
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
