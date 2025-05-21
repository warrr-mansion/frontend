<template>
  <div class="header-wrapper">
    <div class="wide-container d-flex justify-content-between align-items-center py-3">
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
  width: 100%;
}

.wide-container {
  width: 100%; /* 더 넓은 컨테이너 */
  max-width: 1850px; /* 최대 너비 설정 */
  margin: 0 auto;
}

.logo {
  margin: 0;
  font-weight: 800;
  font-size: 28px;
  color: #333;
}

.menu-group {
  display: flex;
  gap: 20px; /* 메뉴 간격 늘림 */
  padding-left: 200px; /* 메뉴들을 더 오른쪽으로 */
}

.menu {
  text-decoration: none;
  color: #222;
  font-weight: 600;
  font-size: 16px;
  padding: 5px 8px; /* 클릭 영역 확대 */
  transition: color 0.2s ease-in-out; /* 부드러운 색상 전환 효과 */
}

.menu:hover {
  color: #783eff;
}
</style>
