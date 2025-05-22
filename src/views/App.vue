<template>
  <AppHeader />
  <router-view />
  <!-- 여기에 라우트된 컴포넌트가 렌더링됩니다 -->
  <AppFooter />
</template>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
</script>

<style scoped></style>
