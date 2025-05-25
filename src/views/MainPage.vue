<template>
  <div class="bg-gray-50 text-gray-800">
    <!-- 검색 영역 -->
    <section
      class="relative bg-cover bg-center py-24 text-white"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <!-- ✅ 그라데이션 오버레이 -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-800 opacity-70 z-0"
      ></div>

      <!-- ✅ 실제 콘텐츠 (z-10으로 오버레이 위로) -->
      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-6 cursor-pointer hover:text-yellow-300 transition">
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
    <section class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 최근 본 매물 -->
      <div class="bg-purple-100 rounded-xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">최근 본 매물</h2>
          <a href="#" class="text-sm text-blue-500 hover:underline">more &gt;</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 shadow-sm rounded-lg text-center">
            <div class="bg-gray-200 h-20 mb-3 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-gray-50 p-4 shadow-sm rounded-lg text-center">
            <div class="bg-gray-200 h-20 mb-3 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-gray-50 p-4 shadow-sm rounded-lg text-center">
            <div class="bg-gray-200 h-20 mb-3 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
        </div>
      </div>

      <!-- 찜한 매물 -->
      <div class="bg-indigo-100 rounded-xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">찜한 매물</h2>
          <a href="#" class="text-sm text-blue-500 hover:underline">more &gt;</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 shadow-sm rounded-lg text-center">
            <div class="bg-gray-200 h-20 mb-3 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-gray-50 p-4 shadow-sm rounded-lg text-center">
            <div class="bg-gray-200 h-20 mb-3 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-gray-50 p-4 shadow-sm rounded-lg text-center">
            <div class="bg-gray-200 h-20 mb-3 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 핵심 서비스 -->
    <section class="bg-gray-50 py-10">
      <div class="max-w-5xl mx-auto px-4">
        <!-- ✅ 카드 박스 전체 -->
        <div class="bg-white rounded-xl shadow p-6">
          <!-- ✅ 제목도 카드 안으로 포함 -->
          <h2 class="text-xl font-semibold text-center mb-6">핵심 서비스</h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div class="bg-gray-300 h-20 w-16 mb-3 rounded"></div>
              <router-link
                to="/map"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >매물 조회</router-link
              >
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div class="bg-gray-300 h-20 w-16 mb-3 rounded"></div>
              <router-link
                to="/map"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >실거래가 조회</router-link
              >
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div class="bg-gray-300 h-20 w-16 mb-3 rounded"></div>
              <router-link
                to="/news"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
                >부동산 뉴스</router-link
              >
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div class="bg-gray-300 h-20 w-16 mb-3 rounded"></div>
              <router-link
                v-if="!globalStatus.isLoggedIn"
                to="/login"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
              >
                찜목록
              </router-link>

              <router-link
                v-else
                to="/myPage"
                class="whitespace-nowrap text-center no-underline text-gray-800 font-semibold"
              >
                찜목록
              </router-link>
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div class="bg-gray-300 h-20 w-16 mb-3 rounded"></div>
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

    <!-- 공지사항 -->
    <section class="py-10">
      <div class="max-w-5xl mx-auto px-4">
        <!-- ✅ 카드 전체 -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-semibold mb-4">공지사항</h2>
          <div class="text-gray-500 text-sm text-center">등록된 공지사항이 없습니다.</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import backgroundUrl from '@/assets/img/mainbackground.jpg'

const globalStatus = inject('globalStatus')

const login = () => {
  if (globalStatus) {
    globalStatus.isLoggedIn = true
    globalStatus.loginUser = { nickname: '게스트' } // 예시 사용자 정보
    console.log('로그인 되었습니다.')
  } else {
    console.warn('globalStatus가 주입되지 않았습니다.')
  }
}
</script>

<style scoped></style>
