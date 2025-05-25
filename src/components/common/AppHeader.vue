<template>
  <div class="header-wrapper">
    <div class="wide-container d-flex justify-between align-items-center py-3">
      <!-- 왼쪽: 로고 클릭 시 홈으로 이동 -->
      <router-link to="/" class="logo">ZipFlex</router-link>

      <!-- 오른쪽: 메뉴 -->
      <nav class="menu-group">
        <router-link to="/notice" class="menu">공지사항</router-link>
        <router-link to="/map" class="menu">매물 조회</router-link>
        <router-link to="/news" class="menu">부동산 뉴스</router-link>

        <template v-if="!globalStatus.isLoggedIn">
          <router-link to="/login" class="menu">로그인</router-link>
          <router-link to="/signup" class="menu">회원가입</router-link>
        </template>

        <template v-else>
          <a href="/" class="menu" @click.prevent="logout">로그아웃</a>
          <router-link to="/myPage" class="menu">마이페이지</router-link>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const globalStatus = inject('globalStatus')

const logout = () => {
  globalStatus.isLoggedIn = false
  globalStatus.loginUser = {}
}
</script>

<style scoped>
.header-wrapper {
  background-color: white;
  width: 100%;
  height: 80px; /* 👈 고정 높이 설정 */
}

.wide-container {
  width: 100%; /* 더 넓은 컨테이너 */
  max-width: 1850px; /* 최대 너비 설정 */
  margin: 0 auto;
}

.logo {
  margin: 0;
  font-weight: 1000;
  font-size: 28px;
  color: #000; /* ✅ 검정색 */
  text-decoration: none; /* ✅ 밑줄 제거 */
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
