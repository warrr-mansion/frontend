<template>
  <AppHeader />
  <body class="bg-gray-50 text-gray-800">
    <!-- 검색 영역 -->
    <section class="bg-gray-100 py-10">
      <div class="max-w-5xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-6">ZipFlex</h1>
        <div class="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="지역, 아파트명을 입력하세요..."
            class="w-full py-3 px-5 pr-12 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
            🔍
          </button>
        </div>
      </div>
    </section>

    <!-- 최근 본 매물 + 찜한 매물 -->
    <section class="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 최근 본 매물 -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">최근 본 매물</h2>
          <a href="#" class="text-sm text-blue-500 hover:underline">more &gt;</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
        </div>
      </div>

      <!-- 찜한 매물 -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">찜한 매물</h2>
          <a href="#" class="text-sm text-blue-500 hover:underline">more &gt;</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
          <div class="bg-white p-3 shadow rounded text-center">
            <div class="bg-gray-200 h-28 mb-2 rounded"></div>
            <div class="font-semibold">아파트</div>
            <div class="text-sm text-gray-500">서울 강남구</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 핵심 서비스 -->
    <section class="bg-gray-100 py-10">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-xl font-semibold text-center mb-6">핵심 서비스</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
          <div class="bg-white p-5 rounded shadow">
            <div class="bg-gray-300 h-16 mb-3 rounded"></div>
            <div>매물 조회</div>
          </div>
          <div class="bg-white p-5 rounded shadow">
            <div class="bg-gray-300 h-16 mb-3 rounded"></div>
            <div>실거래가 조회</div>
          </div>
          <div class="bg-white p-5 rounded shadow">
            <div class="bg-gray-300 h-16 mb-3 rounded"></div>
            <div>부동산 뉴스</div>
          </div>
          <div class="bg-white p-5 rounded shadow">
            <div class="bg-gray-300 h-16 mb-3 rounded"></div>
            <div>찜목록</div>
          </div>
          <div class="bg-white p-5 rounded shadow">
            <div class="bg-gray-300 h-16 mb-3 rounded"></div>
            <div>주변 인기 매물</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 공지사항 -->
    <section class="py-10">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-xl font-semibold mb-4">공지사항</h2>
        <div class="bg-white p-6 rounded shadow text-gray-500 text-sm text-center">
          등록된 공지사항이 없습니다.
        </div>
      </div>
    </section>
  </body>
  <AppFooter />
</template>

<script>
import { onMounted, getCurrentInstance } from 'vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style scoped></style>
