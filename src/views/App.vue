<!-- App.vue -->
<template>
  <div class="layout-wrapper">
    <AppHeader />
    <div class="router-container">
      <router-view />
    </div>
    <AppFooter />
    <ChatBot />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.router-container {
  flex: 1;
  overflow: hidden; /* 필요 시 추가 */
}
</style>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import ChatBot from './ChatBot.vue'
</script>
