<template>
  <div class="success-wrapper">
    <div class="success-content">
      <div class="flower-image">
        <img src="@/assets/img/flower-bouquet.png" alt="축하 꽃다발" />
      </div>
      <div class="text-content">
        <h1 class="success-title">가입을 축하드립니다!</h1>
        <p class="success-message">지금 바로 로그인하고 서비스를 이용해보세요.</p>
        <router-link to="/login" class="login-btn">로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
  padding: 2rem;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 800px;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flower-image {
  width: 100%;
  max-width: 360px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.flower-image img {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.flower-image:hover {
  transform: scale(1.03);
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.success-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

.success-message {
  font-size: 1.25rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
  max-width: 28rem;
  word-break: keep-all;
}

.login-btn {
  display: inline-block;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  padding: 1rem 2.5rem;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(99, 102, 241, 0.3);
}

@media (min-width: 768px) {
  .success-content {
    flex-direction: row;
    text-align: left;
    gap: 4rem;
  }

  .text-content {
    align-items: flex-start;
  }

  .flower-image {
    margin-bottom: 0;
  }
}
</style>
