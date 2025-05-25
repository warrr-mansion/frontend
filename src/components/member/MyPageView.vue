<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- 사용자 영역 -->
    <div
      class="relative bg-cover bg-center h-[306px] text-white flex items-center"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <!-- 그라데이션 오버레이 -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-800 opacity-70 z-0"
      ></div>

      <!-- 사용자 정보 콘텐츠 (크기 통일 + 왼쪽 정렬) -->
      <div
        class="relative z-10 max-w-5xl mx-auto px-6 flex items-center justify-start gap-6 w-full"
      >
        <div
          class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-500 text-4xl"
        >
          👤
        </div>
        <div>
          <h2 class="text-2xl font-bold">김규찬 님</h2>
          <p class="text-base">email : gyudol@naver.com</p>
        </div>
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
      </div>

      <!-- 매물 카드 목록 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- 찜한 매물 목록 -->
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

        <!-- 최근 본 매물 목록 -->
        <template v-else>
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
import { ref } from 'vue'
import backgroundUrl from '@/assets/img/mainbackground.jpg'

// 현재 선택된 탭
const activeTab = ref('찜한 매물')
</script>

<style scoped></style>
