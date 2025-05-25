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
  background-color: #e5e5e5; /* 원하는 회색으로 설정 */
  border-top: 1px solid #ccc;
  font-size: 14px;
  color: #666;

  height: 100px;
  box-sizing: border-box;
}

/* 💡 margin-left → padding-left로 대체해 배경이 끊기지 않게 */
.footer-container {
  max-width: 1850px;
  display: flex;
  align-items: center;
  padding-left: 30px; /* ✅ 수정: 배경 끊김 방지 */
  justify-content: flex-start;
}

/* 불필요한 배경 지정 제거 */
.footer-left,
.footer-right,
.footer-divider {
  background: transparent;
}

.footer-left {
  flex: 0 0 auto; /* flex-grow를 0으로 변경하여 내용물 크기만큼만 차지하도록 함 */
  margin-right: 20px; /* 오른쪽 마진 추가 */
}

.footer-divider {
  width: 1px;
  height: 80px;
  background-color: #ccc;
  margin-right: 40px; /* ✅ 링크와 수직선 사이 간격 */
  margin: 10px 10px;
}

.footer-right {
  display: flex;
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-column a {
  text-decoration: none;
  color: #666;
}

.footer-column a:hover {
  color: #333;
}
</style>
