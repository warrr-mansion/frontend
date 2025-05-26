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
          <button @click="handleLogout" class="menu">로그아웃</button>

          <router-link to="/myPage" class="menu">마이페이지</router-link>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth'
import { inject } from 'vue'

const globalStatus = inject('globalStatus')

const router = useRouter()

const handleLogout = () => {
  logout(globalStatus, router)
}
</script>
vue 복사 편집

<style scoped>
.wide-container {
  width: 100%; /* 더 넓은 컨테이너 */
  max-width: 1850px; /* 최대 너비 설정 */
  margin: 0 auto;
}

.header-wrapper {
  background-color: white;
  width: 100%;
  height: 80px;
  font-family: 'Noto Sans KR', sans-serif; /* ✅ 글꼴 적용 */
}

.logo {
  margin: 0;
  font-weight: 900; /* ✅ Noto Sans KR에 맞게 bold 조정 */
  font-size: 28px;
  color: #000;
  text-decoration: none;
}

.menu-group {
  display: flex;
  gap: 20px;
  padding-left: 200px;
}

.menu {
  text-decoration: none;
  color: #222;
  font-weight: 600;
  font-size: 16px;
  padding: 5px 8px;
  transition: color 0.2s ease-in-out;
  font-family: 'Noto Sans KR', sans-serif; /* ✅ 명시적 적용 (혹시 inheritance 안 될 때) */
}

.menu:hover {
  color: #783eff;
}
</style>
