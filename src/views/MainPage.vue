<template>
  <div class="bg-gray-50 text-gray-800">
    <!-- 검색 영역 -->
    <section
      class="relative bg-cover bg-center py-15 text-white"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <!-- ✅ 그라데이션 오버레이 -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-800 opacity-70 z-0"
      ></div>

      <!-- ✅ 실제 콘텐츠 (z-10으로 오버레이 위로) -->
      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-6 p-5 cursor-pointer hover:text-yellow-300 transition">
          ZipFlex
        </h1>
        <div class="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="지역, 아파트명을 입력하세요"
            class="w-full py-3 px-5 pr-12 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-600 bg-white placeholder-gray-500"
          />

          <button
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300"
          >
            🔍
          </button>
        </div>
      </div>
    </section>

    <!-- 최근 본 매물 + 찜한 매물 -->
    <section class="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 최근 본 매물 -->
      <div class="bg-purple-100 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">최근 본 매물</h2>
          <a href="#" class="text-sm text-blue-500 hover:underline">more &gt;</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div
            class="bg-gray-50 p-4 shadow-sm rounded-lg text-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
          >
            <div
              class="h-20 mb-3 rounded bg-cover bg-center"
              :style="{ backgroundImage: `url(${apartmentUrl})` }"
            ></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div
            class="bg-gray-50 p-4 shadow-sm rounded-lg text-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
          >
            <div
              class="h-20 mb-3 rounded bg-cover bg-center"
              :style="{ backgroundImage: `url(${apartmentUrl})` }"
            ></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div
            class="bg-gray-50 p-4 shadow-sm rounded-lg text-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
          >
            <div
              class="h-20 mb-3 rounded bg-cover bg-center"
              :style="{ backgroundImage: `url(${apartmentUrl})` }"
            ></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
        </div>
      </div>

      <!-- 찜한 매물 -->
      <div class="bg-indigo-100 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">찜한 매물</h2>
          <router-link to="/myPage" class="text-sm text-blue-500 hover:underline"
            >more &gt;</router-link
          >
        </div>

        <div
          v-if="favoriteHouses.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div
            v-for="house in favoriteHouses"
            :key="house.id"
            class="bg-gray-50 p-4 shadow-sm rounded-lg text-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
          >
            <div
              class="h-20 mb-3 rounded bg-cover bg-center"
              :style="{ backgroundImage: `url(${apartmentUrl})` }"
            ></div>
            <div class="text-sm font-semibold">{{ house.buildingName }}</div>
            <div class="text-sm text-gray-500">{{ house.emdName }}</div>
          </div>
        </div>

        <div v-else class="text-sm text-gray-500 text-center italic">찜한 매물이 없습니다.</div>
      </div>
    </section>

    <!-- 핵심 서비스 -->
    <section class="bg-gray-50 py-10">
      <div class="max-w-5xl mx-auto px-4">
        <!-- ✅ 카드 박스 전체 -->
        <div class="bg-white rounded-lg shadow p-6">
          <!-- ✅ 제목도 카드 안으로 포함 -->
          <h2 class="text-xl font-semibold text-center mb-6">핵심 서비스</h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            <div
              class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
            >
              <router-link
                to="/map"
                class="h-20 w-16 mb-3 rounded bg-cover bg-center"
                :style="{ backgroundImage: `url(${propertyviewUrl})` }"
              ></router-link>
              <router-link
                to="/map"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >매물 조회</router-link
              >
            </div>
            <div
              class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
            >
              <router-link
                to="/map"
                class="h-20 w-16 mb-3 rounded bg-cover bg-center"
                :style="{ backgroundImage: `url(${dealviewUrl})` }"
              ></router-link>
              <router-link
                to="/map"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >실거래가 조회</router-link
              >
            </div>
            <div
              class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
            >
              <router-link
                to="/news"
                class="h-20 w-16 mb-3 rounded bg-cover bg-center"
                :style="{ backgroundImage: `url(${estatenewsUrl})` }"
              ></router-link>
              <router-link
                to="/news"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >부동산 뉴스</router-link
              >
            </div>
            <div
              class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
            >
              <router-link
                :to="globalStore.isLoggedIn ? '/myPage' : '/login'"
                class="h-20 w-16 mb-3 rounded bg-cover bg-center"
                :style="{ backgroundImage: `url(${favoriteUrl})` }"
              />

              <router-link
                :to="globalStore.isLoggedIn ? '/myPage' : '/login'"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
              >
                찜목록
              </router-link>
            </div>
            <div
              class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out"
            >
              <router-link
                to="/"
                class="h-20 w-16 mb-3 rounded bg-cover bg-center"
                :style="{ backgroundImage: `url(${hotpropertyUrl})` }"
              ></router-link>
              <router-link
                to="/"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >주변 인기 매물</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-10">
      <div class="max-w-5xl mx-auto px-4">
        <!-- ✅ 공지사항도 카드 안으로 통일 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">공지사항</h2>
            <router-link to="/notice" class="text-sm text-indigo-600 hover:underline font-medium">
              더보기 &rarr;
            </router-link>
          </div>

          <div v-if="notices.length > 0" class="space-y-3">
            <div
              v-for="notice in notices.slice(0, 3)"
              :key="notice.id"
              @click="goToDetail(notice.id)"
              class="cursor-pointer p-4 bg-gray-50 rounded-md hover:bg-indigo-50 transition"
            >
              <div class="flex justify-between items-center">
                <div class="font-medium text-gray-800 truncate font-semibold">
                  {{ notice.title }}
                </div>
                <div class="text-xs text-gray-500 ml-4 shrink-0">
                  {{ formatDate(notice.date) }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center text-gray-400 text-sm italic py-12">
            등록된 공지사항이 없습니다.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global' // ✅ Pinia store import
import { getCookie } from '@/utils/cookie'
import backgroundUrl from '@/assets/img/mainbackground.jpg'
import propertyviewUrl from '@/assets/img/매물조회.png'
import estatenewsUrl from '@/assets/img/부동산뉴스.png'
import dealviewUrl from '@/assets/img/실거래가조회.png'
import hotpropertyUrl from '@/assets/img/인기매물.png'
import favoriteUrl from '@/assets/img/찜목록.png'
import apartmentUrl from '@/assets/img/아파트.png'
import axios from 'axios'

const notices = ref([])
const router = useRouter()
const globalStore = useGlobalStore() // ✅ Pinia 상태 사용
const favoriteHouses = ref([])

const fetchNotices = async () => {
  try {
    const res = await axios.get('/v1/notices')
    console.log('📦 공지사항 응답:', res.data)
    notices.value = res.data.result.content
  } catch (err) {
    console.error('공지사항 로딩 실패:', err)
  }
}

const fetchFavoriteHouses = async () => {
  try {
    const token = getCookie('accessToken')
    if (!token) {
      console.warn('❗ 토큰이 없음: 요청 취소')
      return
    }

    console.log('📡 관심매물 요청 시작: pageNo=1, pageSize=3')
    const res = await axios.get('/v1/favorites/HOUSE', {
      params: {
        pageNo: 1,
        pageSize: 3,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('✅ 관심매물 응답 수신:', res.data)

    if (res?.data?.result?.content) {
      favoriteHouses.value = res.data.result.content
      console.log('📦 관심매물 저장 완료:', favoriteHouses.value)
    } else {
      console.warn('⚠️ 응답에 content가 없음 또는 비정상:', res.data)
    }
  } catch (err) {
    console.error('❌ 관심매물 로딩 실패:', err)
  }
}

const goToDetail = (id) => {
  router.push({ name: 'NoticeDetail', params: { id } })
}

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  return isoDate.slice(0, 10).replace(/-/g, '.')
}

onMounted(() => {
  fetchNotices()
  fetchFavoriteHouses()
})
</script>

<style scoped></style>
