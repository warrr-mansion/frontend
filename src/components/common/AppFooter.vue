<template>
  <footer class="footer-wrapper">
    <div class="container footer-container">
      <!-- 왼쪽: 저작권 -->
      <div class="footer-left">
        <p>© 2025 Warrr Mansion. All rights reserved.</p>
      </div>

      <!-- 가운데: 수직 경계선 -->
      <div class="footer-divider"></div>

      <!-- 오른쪽: 링크 메뉴 -->
      <div class="footer-right">
        <div class="footer-column">
          <a href="#">About us</a>
          <a href="#">이용약관</a>
          <a href="#">개인정보 처리방침</a>
          <a href="#">광고 및 제휴 문의</a>
        </div>
        <div class="footer-column">
          <a href="#">매물 조회</a>
          <a href="#">부동산 뉴스</a>
          <a href="#">로그인</a>
          <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer-wrapper {
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  font-size: 14px;
  color: #666;
}

.footer-container {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
}

.footer-left {
  flex: 1;
}

.footer-divider {
  width: 1px;
  height: 100px; /* 고정 높이로 설정하여 수직선 보이도록 */
  background-color: #ccc;
  margin: 5px 5px;
}

.footer-right {
  display: flex;
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-column a {
  text-decoration: none;
  color: #666;
}

.footer-column a:hover {
  color: #333;
}
</style>
