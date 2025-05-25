<template>
  <div class="news-wrapper">
    <div class="news-header">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">📅 {{ today }}</h1>
      <h2 class="text-xl font-semibold text-gray-700">부동산 뉴스</h2>
    </div>

    <div class="news-list">
      <div v-for="(article, index) in paginatedArticles" :key="index" class="news-card">
        <h3 class="news-title">{{ article.title }}</h3>
        <p class="news-snippet">{{ article.content.slice(0, 30) }}...</p>
        <div class="news-meta">
          <span class="news-source">{{ article.source }}</span>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const articles = ref([
  {
    title: '서울 아파트 매매가 상승세 전환',
    content: '서울 지역의 아파트 매매가가 최근 다시 상승세로 돌아섰다...',
    source: '한국경제',
  },
  {
    title: '재건축 규제 완화, 시장 반응은?',
    content: '정부의 재건축 규제 완화 조치에 시장은 엇갈린 반응을 보이고 있다...',
    source: '매일경제',
  },
  {
    title: '부동산 세제 개편안 발표',
    content: '기획재정부는 올해 하반기부터 적용될 부동산 세제 개편안을 발표했다...',
    source: '조선일보',
  },
  {
    title: '전세 사기 예방 위한 법안 통과',
    content: '국회는 전세 사기 피해를 줄이기 위한 법안을 통과시켰다...',
    source: '중앙일보',
  },
  {
    title: '금리 인하, 주택 시장에 영향 줄까',
    content: '한국은행의 기준금리 인하가 주택 시장에 어떤 영향을 미칠지 관심이 모인다...',
    source: '한겨레',
  },
])

const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() => Math.ceil(articles.value.length / pageSize))

const paginatedArticles = computed(() =>
  articles.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize),
)
</script>

<style scoped>
.news-wrapper {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9fafb;
  min-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

.news-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.news-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  background: #ffffff;
  transition: background-color 0.2s ease;
}

.news-card:hover {
  background-color: #f3f4f6;
}

.news-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-top: 6px;
  margin-bottom: 6px;
}

.news-snippet {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 8px;
}

.news-meta {
  text-align: right;
}

.news-source {
  font-size: 0.75rem;
  color: #9ca3af;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
}

.page-btn:hover {
  background-color: #f3f4f6;
}

.page-btn.active {
  background-color: #6366f1;
  color: white;
  border-color: #6366f1;
}
</style>
