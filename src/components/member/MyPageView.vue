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
          >회원정보 수정</router-link
        >
      </div>
    </div>

    <!-- 탭 및 콘텐츠 -->
    <div class="max-w-5xl mx-auto bg-gray-200 mt-8 px-8 py-6">
      <!-- 탭 -->
      <div class="flex gap-6 text-gray-600 font-semibold mb-4 border-b border-gray-600 pb-2">
        <div
          :class="[
            activeTab === '관심지역' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="handleTabChange('관심지역')"
        >
          관심지역
        </div>
        <div
          :class="[
            activeTab === '관심지역 설정' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="handleTabChange('관심지역 설정')"
        >
          관심지역 설정
        </div>
        <div
          :class="[
            activeTab === '관심매물' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="handleTabChange('관심매물')"
        >
          관심매물
        </div>

        <div
          :class="[
            activeTab === '최근 본 매물' ? 'text-black border-b-2 border-black' : 'cursor-pointer',
          ]"
          @click="handleTabChange('최근 본 매물')"
        >
          최근 본 매물
        </div>
      </div>

      <!-- 콘텐츠 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- 관심지역 -->
        <template v-if="activeTab === '관심지역'">
          <div v-if="favoriteRegions.length === 0" class="col-span-full text-gray-500 text-center">
            등록된 관심지역이 없습니다.
          </div>
          <ul v-else class="col-span-full space-y-3">
            <li
              v-for="region in favoriteRegions"
              :key="region.id"
              class="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div class="font-semibold">
                  {{ region.sidoName }} {{ region.gugunName || '' }} {{ region.dongName || '' }}
                </div>
                <div class="text-sm text-gray-500">법정동 코드: {{ region.regionCode }}</div>
              </div>
              <button
                @click="deleteRegion(region.regionCode)"
                class="text-sm text-red-500 hover:underline"
              >
                삭제
              </button>
            </li>
          </ul>
        </template>

        <!-- 관심지역 설정 -->
        <template v-else-if="activeTab === '관심지역 설정'">
          <FavoriteRegionSelector
            v-model:buildingType="buildingType"
            v-model:sido="sido"
            v-model:gugun="gugun"
            v-model:dong="dong"
            :sidoList="sidoList"
            :gugunList="gugunList"
            :dongList="dongList"
            :loading="loading"
            @add="addFavoriteRegion"
          />
        </template>

        <!-- 관심매물 -->
        <template v-else-if="activeTab === '관심매물'">
          <div v-if="favoriteHouses.length === 0" class="col-span-full text-gray-500 text-center">
            등록된 관심매물이 없습니다.
          </div>
          <div
            v-else
            v-for="house in favoriteHouses"
            :key="house.id"
            class="bg-white shadow rounded overflow-hidden"
          >
            <div class="bg-gray-300 h-48 flex items-center justify-center text-sm text-gray-600">
              {{ house.buildingName || '매물 이미지' }}
            </div>
            <div class="p-4">
              <div class="text-lg font-bold text-gray-800 mb-1">
                {{ house.buildingName }} ({{ house.houseType }})
              </div>
              <div class="text-sm text-gray-600">
                {{ house.sidoName }} {{ house.gugunName }} {{ house.roadName }}
              </div>
              <div class="text-sm text-gray-600">지번: {{ house.jibun }}</div>
              <div class="text-sm text-gray-600">건축년도: {{ house.buildYear }}</div>
              <button
                @click="deleteFavoriteHouseById(house.houseInfoId)"
                class="text-red-500 text-sm mt-2 hover:underline"
              >
                삭제
              </button>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { getUserInfo } from '@/api/auth'
import backgroundUrl from '@/assets/img/mainbackground.jpg'
import {
  fetchFavoriteHouses,
  deleteFavoriteHouse,
  fetchFavoriteRegions,
  addFavoriteRegionAPI,
  deleteFavoriteRegion,
} from '@/api/favorite'
import FavoriteRegionSelector from '@/components/region/FavoriteRegionSelector.vue'
import api from '@/api/axiosInstance'

const globalStore = useGlobalStore()
const activeTab = ref('관심지역')

const favoriteHouses = ref([])
const housePageNo = ref(1)
const housePageSize = 10
const houseHasNext = ref(false)

const favoriteRegions = ref([])
const regionPageNo = ref(1)
const regionPageSize = 10
const regionHasNext = ref(false)

const buildingType = ref('')
const sido = ref('')
const gugun = ref('')
const dong = ref('')
const sidoList = ref([])
const gugunList = ref([])
const dongList = ref([])
const loading = ref(false)

const nickname = computed(() => globalStore.loginUser?.nickname || '')
const email = computed(() => globalStore.loginUser?.email || '')

const fetchHouses = async () => {
  try {
    const res = await fetchFavoriteHouses(housePageNo.value, housePageSize)
    if (res?.result?.content) {
      favoriteHouses.value.push(...res.result.content)
      houseHasNext.value = res.result.hasNext
    } else {
      console.warn('⚠️ 관심매물 응답 비정상:', res)
    }
  } catch (err) {
    console.error('❌ 관심매물 조회 실패:', err)
  }
}

const deleteFavoriteHouseById = async (houseInfoId) => {
  console.log('🚨 관심매물 삭제 요청:', houseInfoId)

  try {
    await deleteFavoriteHouse(houseInfoId)
    console.log('✅ 삭제 성공')

    // 💡 기존 목록 초기화 후 다시 요청
    resetFavoriteHouses()
    await fetchHouses()

    // 🔔 유저 피드백
  } catch (err) {
    console.error('❌ 관심매물 삭제 실패:', err.response?.data || err.message)
  }
}

const resetFavoriteHouses = () => {
  favoriteHouses.value = []
  housePageNo.value = 1
  houseHasNext.value = false
}

const fetchRegions = async () => {
  try {
    const res = await fetchFavoriteRegions(regionPageNo.value, regionPageSize)
    if (res?.result?.content) {
      favoriteRegions.value = [...res.result.content]
      regionHasNext.value = res.result.hasNext
    } else {
      console.warn('⚠️ 관심지역 응답 비정상:', res)
    }
  } catch (err) {
    console.error('❌ 관심지역 조회 실패:', err)
  }
}

const addFavoriteRegion = async () => {
  console.log('🚀 addFavoriteRegion triggered')

  if (!dong.value) {
    console.warn('❌ dong 값 없음', dong.value)
    return
  }

  const payload = {
    favoriteType: 'REGION',
    code: String(dong.value),
  }

  console.log('📦 등록 payload:', payload)

  try {
    const res = await api.post('/v1/favorites', payload)
    console.log('✅ 등록 성공:', res.data)
  } catch (err) {
    console.error('❌ 등록 실패:', err)
  }
}

const deleteRegion = async (regionCode) => {
  console.log('🚨 관심지역 삭제 요청:', regionCode)
  try {
    await deleteFavoriteRegion(regionCode)
    console.log('✅ 삭제 성공')
    await fetchRegions()
  } catch (err) {
    console.error('❌ 삭제 실패:', err.response?.data || err.message)
  }
}

const resetFavoriteRegions = () => {
  favoriteRegions.value = []
  regionPageNo.value = 1
  regionHasNext.value = false
}

const fetchSido = async () => {
  const res = await fetch('/v1/regions/sido')
  sidoList.value = await res.json()
}

const fetchGugun = async (sidoCode) => {
  const res = await fetch(`/v1/regions/sido/${sidoCode}/gugun`)
  gugunList.value = (await res.json()).map((item) => ({ code: item.code, name: item.name }))
  gugun.value = ''
  dongList.value = []
  dong.value = ''
}

const fetchDong = async (sidoCode, gugunCode) => {
  const res = await fetch(`/v1/regions/gugun/${gugunCode}/dong`)
  dongList.value = (await res.json()).map((item) => ({ code: item.code, name: item.name }))
  dong.value = ''
}

watch(sido, async (newVal) => {
  if (newVal) {
    gugun.value = ''
    dong.value = ''
    gugunList.value = []
    dongList.value = []
    await fetchGugun(newVal)
  }
})

watch(gugun, async (newVal) => {
  if (newVal) {
    dong.value = ''
    dongList.value = []
    await fetchDong(sido.value, newVal)
  }
})

const handleTabChange = async (tabName) => {
  activeTab.value = tabName

  if (tabName === '관심매물') {
    resetFavoriteHouses()
    await fetchHouses()
  } else if (tabName === '관심지역') {
    resetFavoriteRegions()
    await fetchRegions()
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

onMounted(async () => {
  const accessToken = getCookie('accessToken')
  if (!accessToken) return

  const data = await getUserInfo()
  if (!data?.result) return

  const result = data.result
  globalStore.setUser({
    uuid: result.memberUuid,
    nickname: result.nickname,
    email: result.email,
    role: result.role,
    state: result.state,
    accessToken,
  })

  await fetchSido()
  await fetchRegions()
})
</script>
