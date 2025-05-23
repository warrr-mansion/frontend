<template>
  <div class="notice-detail-wrapper">
    <div class="detail-box">
      <h1 class="detail-title">{{ notice.title }}</h1>
      <p class="detail-date">{{ notice.date }}</p>
      <p class="detail-content">{{ notice.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = parseInt(route.params.id, 10)

// 더미 데이터 (실제 프로젝트에선 API로 요청)
const dummyNotices = ref([
  {
    id: 1,
    title: '시스템 점검 안내',
    date: '2025-05-22',
    content:
      '안녕하세요. ZipFlex 운영팀입니다.\n\n더 나은 서비스 제공을 위해 아래 일정으로 시스템 점검이 진행될 예정입니다. 점검 시간 동안에는 매물 조회, 로그인, 회원가입 등 일부 서비스 이용이 제한될 수 있습니다.\n\n⏱ 점검 일정: 2025년 5월 25일(토) 00:00 ~ 02:00\n\n이용에 불편을 드려 죄송하며, 더욱 안정적인 서비스 제공을 위한 조치이니 많은 양해 부탁드립니다. 감사합니다.',
  },
  {
    id: 2,
    title: '모바일 앱 출시 안내',
    date: '2025-05-18',
    content:
      '안녕하세요, ZipFlex 사용자 여러분!\n\n많은 분들이 기다려주신 ZipFlex 모바일 앱이 드디어 출시되었습니다. 이제 스마트폰에서도 손쉽게 매물을 검색하고, 찜 목록을 관리하며, 실거래가를 확인할 수 있습니다.\n\n📱 주요 기능:\n- 실시간 위치 기반 매물 탐색\n- 사용자 맞춤형 알림 서비스\n- 부동산 뉴스 및 분석 콘텐츠 제공\n\nGoogle Play와 App Store에서 "ZipFlex"를 검색해주세요. 앞으로도 여러분의 편리한 부동산 경험을 위해 최선을 다하겠습니다.',
  },
  {
    id: 3,
    title: '2025년 상반기 고객 설문조사 실시',
    date: '2025-05-12',
    content:
      '항상 ZipFlex를 이용해주시는 고객 여러분께 감사드립니다.\n\n더 나은 사용자 경험을 제공하기 위해, 2025년 상반기 고객 만족도 설문조사를 실시합니다. 설문에 참여해주신 분들 중 추첨을 통해 소정의 상품을 드릴 예정입니다.\n\n📋 참여 기간: 2025년 5월 12일 ~ 5월 31일\n🎁 경품: 커피 기프티콘 (50명), ZipFlex 굿즈 키트 (10명)\n\n설문은 메인 페이지 상단 배너 또는 알림톡을 통해 접속 가능합니다. 많은 참여 부탁드립니다!',
  },
  {
    id: 4,
    title: '개인정보 처리방침 변경 사전 안내',
    date: '2025-05-10',
    content:
      '안녕하세요. ZipFlex 개인정보보호 책임자입니다.\n\n개인정보 보호법 및 관련 법령 개정에 따라, 2025년 6월 1일부로 개인정보 처리방침이 변경될 예정입니다. 주요 변경사항은 다음과 같습니다.\n\n1. 수집 항목 및 이용 목적의 구체화\n2. 외부 위탁 처리 내역의 추가\n3. 이용자 권리 강화 조항 신설\n\n변경되는 내용은 홈페이지 하단의 "개인정보 처리방침" 메뉴를 통해 확인하실 수 있습니다. 서비스 이용에 참고하시기 바랍니다.',
  },
  {
    id: 5,
    title: '중개사무소 제휴 신청 오픈',
    date: '2025-05-08',
    content:
      '안녕하세요. ZipFlex 제휴 담당팀입니다.\n\nZipFlex 플랫폼과 함께할 부동산 중개사무소의 제휴 신청이 오픈되었습니다. 플랫폼 기반 광고 지원, 매물 노출 최적화, 실시간 고객 상담 연동 등 다양한 혜택을 제공해 드립니다.\n\n제휴 대상: 정식 등록된 중개업소 (개업공인중개사 포함)\n신청 방법: 제휴 페이지에서 양식 제출\n접수 기간: 2025년 5월 8일 ~ 6월 30일\n\n보다 효율적인 부동산 중개 환경을 ZipFlex와 함께 만들어보세요!',
  },
])

const notice = computed(
  () =>
    dummyNotices.value.find((n) => n.id === id) || {
      title: '공지사항을 찾을 수 없습니다.',
      date: '',
      content: '',
    },
)
</script>

<style scoped>
.notice-detail-wrapper {
  height: calc(100vh - 180px);
  background-color: #f4f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
}
.detail-box {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.detail-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #111827;
}
.detail-date {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 24px;
}
.detail-content {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-line;
}
</style>
