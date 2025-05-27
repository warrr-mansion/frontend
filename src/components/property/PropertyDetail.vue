<template>
  <div class="property-detail">
    <div :style="{ padding: '20px', fontSize: '14px', color: '#1f2937' }">
      <!-- 제목 -->
      <div
        :style="{
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px',
          marginBottom: '20px',
        }"
      >
        <!-- 제목 아래 버튼 -->
        <div
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }"
        >
          <h2
            :style="{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '6px',
              color: '#111827',
            }"
          >
            {{ getBuildingEmoji(buildingType) }} {{ property?.buildingName }}
          </h2>

          <button
            @click="registerFavoriteHouse"
            :style="{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }"
          >
            + 관심매물 등록
          </button>
        </div>

        <p :style="{ color: '#6b7280', fontSize: '14px', margin: 0 }">
          {{ property?.emdName }} · {{ property?.roadName }}
        </p>
      </div>

      <!-- 체크박스 필터 -->
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }"
      >
        <h3 :style="{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: 0 }">
          실거래가 내역
        </h3>
        <div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
          <label :style="checkboxLabelStyle"
            ><input type="checkbox" v-model="dealTypes" value="전세" /> 전세</label
          >
          <label :style="checkboxLabelStyle"
            ><input type="checkbox" v-model="dealTypes" value="월세" /> 월세</label
          >
          <label :style="checkboxLabelStyle"
            ><input type="checkbox" v-model="dealTypes" value="매매" /> 매매</label
          >
        </div>
      </div>

      <!-- 거래 내역 -->
      <div
        v-if="!filteredDeals || filteredDeals.length === 0"
        :style="{
          textAlign: 'center',
          color: '#6b7280',
          padding: '40px 20px',
          background: '#f9fafb',
          borderRadius: '8px',
        }"
      >
        실거래가 데이터가 없습니다.
      </div>

      <div v-else :style="{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }">
        <div
          v-for="deal in filteredDeals"
          :key="deal.id"
          :style="{
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px',
            transition: 'all 0.2s ease',
          }"
        >
          <div
            :style="{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
            }"
          >
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '4px' }">
              <span
                :style="{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  background: '#e5e7eb',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  width: 'fit-content',
                }"
              >
                {{ getDealType(deal.contractType) }}
              </span>
              <span :style="{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }">
                {{ formatDealInfo(deal.dealAmount, deal.monthlyRent, deal.contractType) }}
              </span>
            </div>
            <div :style="{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }">
              {{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}
            </div>
          </div>

          <div
            :style="{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '8px',
              borderTop: '1px solid #e5e7eb',
            }"
          >
            <div :style="{ display: 'flex', gap: '12px', fontSize: '13px', color: '#4b5563' }">
              <span :style="{ fontWeight: 500 }">{{ formatArea(deal.exclusiveArea) }}</span>
              <span :style="{ color: '#6b7280' }">{{ deal.floor }}층</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { getCookie } from '@/utils/cookie'

const showToast = (message) => {
  alert(message) // 또는 별도 토스트 컴포넌트로 대체
}

const registerFavoriteHouse = async () => {
  try {
    console.log('💖 관심매물 등록 요청:', props.property.id)

    const accessToken = getCookie('accessToken')

    await axios.post(
      '/v1/favorites',
      {
        favoriteType: 'HOUSE',
        code: String(props.property.id),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    showToast('📌 관심매물로 등록되었습니다!')
  } catch (err) {
    console.error('❌ 관심매물 등록 실패', err)
    showToast('❗ 관심매물 등록에 실패했습니다.')
  }
}

const props = defineProps({
  property: Object,
  buildingType: String,
  houseDeals: Array,
})

const dealTypes = ref(['전세', '월세', '매매'])

const contractTypeMap = {
  전세: 'JEONSE',
  월세: 'MONTHLY',
  매매: 'SALE',
}

const emojiMap = {
  APARTMENT: '🏢',
  VILLA: '🏘️',
  OFFICETEL: '🏙️',
}

const checkboxLabelStyle = {
  fontSize: '13px',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}

const filteredDeals = computed(() =>
  props.houseDeals.filter((deal) =>
    dealTypes.value.some((type) => deal.contractType === contractTypeMap[type]),
  ),
)

const getBuildingEmoji = (type) => emojiMap[type] || '🏠'

const getDealType = (contractType) => {
  const map = {
    JEONSE: '전세',
    MONTHLY: '월세',
    SALE: '매매',
  }
  return map[contractType] || '기타'
}

const formatDealInfo = (amount, monthly, type) => {
  if (type === 'MONTHLY') return `${formatPrice(amount)}/${monthly}만`
  return formatPrice(amount)
}

const formatPrice = (amount) => {
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000)
    const rest = amount % 10000
    return rest > 0 ? `${eok}억 ${rest.toLocaleString()}만` : `${eok}억`
  }
  return `${amount.toLocaleString()}만`
}

const formatDate = (year, month, day) =>
  `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`

const formatArea = (area) => `${area}㎡ (${(area * 0.3025).toFixed(1)}평)`
</script>
