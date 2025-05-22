<template>
  <div class="full-page-content">
    <ExtraLibraryTestVue />
  </div>
</template>

<script setup>
import ExtraLibraryTestVue from '@/views/extra/KaKaoMap.vue'
</script>

<style>
.full-page-content {
  min-height: calc(100vh - 180px); /* 헤더 + 푸터 높이 제외 */
  display: flex;
  flex-direction: column;
}
</style>
