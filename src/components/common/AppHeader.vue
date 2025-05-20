<template>
  <div class="header-wrapper">
    <div class="container d-flex justify-content-between align-items-center py-3">
      <!-- 왼쪽: 제목 -->
      <h1 class="logo">ZipFlex</h1>

      <!-- 오른쪽: 메뉴 -->
      <nav class="menu-group">
        <a href="#" class="menu">공지사항</a>
        <a href="#" class="menu">매물 조회</a>
        <a href="#" class="menu">부동산 뉴스</a>

        <template v-if="!globalStatus.isLoggedIn">
          <a href="#" class="menu">로그인</a>
          <a href="#" class="menu">회원가입</a>
        </template>

        <template v-else>
          <a href="#" class="menu" @click.prevent="logout">로그아웃</a>
          <a href="#" class="menu">마이페이지</a>
        </template>
      </nav>
    </div>
    <hr />
  </div>
</template>

<script setup>
import { inject } from 'vue'
const globalStatus = inject('globalStatus')

const logout = () => {
  globalStatus.value.isLoggedIn = false
  globalStatus.value.loginUser = {}
}
</script>

<style scoped>
.header-wrapper {
  background-color: white;
}

.logo {
  margin: 0;
  font-weight: 800;
  font-size: 28px;
  color: #333;
}

.menu-group {
  display: flex;
  gap: 24px;
}

.menu {
  text-decoration: none; /* 밑줄 제거 */
  color: #222; /* 링크 색상 */
  font-weight: 600;
  font-size: 16px;
}

.menu:hover {
  color: #783eff;
}
</style>
