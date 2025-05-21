<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <ExtraLibraryTestVue />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue'

import ExtraLibraryTestVue from '@/views/extra/KaKaoMap.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 225px); /* 헤더와 푸터 높이에 따라 조정 */
}
</style>
