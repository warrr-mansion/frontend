<template>
  <div class="map-container">
    <!-- 지역 선택 바 -->
    <div class="region-select-container">
      <select v-model="buildingType" class="region-select">
        <option disabled value="">건물 유형 선택</option>
        <option value="APARTMENT">아파트</option>
        <option value="VILLA">빌라</option>
        <option value="OFFICETEL">오피스텔</option>
      </select>

      <select v-model="sido" class="region-select">
        <option disabled value="">시도 선택</option>
        <option v-for="item in sidoList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <select v-model="gugun" class="region-select" :disabled="!sido">
        <option disabled value="">구군 선택</option>
        <option v-for="item in gugunList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <select v-model="dong" class="region-select" :disabled="!gugun">
        <option disabled value="">읍면동 선택</option>
        <option v-for="item in dongList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <button @click="fetchProperties" :disabled="!buildingType" class="search-button">조회</button>

      <div v-if="loading" class="spinner"></div>
    </div>

    <!-- 매물 목록 -->
    <div class="property-sidebar">
      <div class="property-list">
        <div v-if="(!propertyList || propertyList.length === 0) && !loading" class="no-result">
          조회된 매물이 없습니다.
        </div>
        <div
          class="property-item"
          v-for="item in propertyList || []"
          :key="item.id"
          :class="{ selected: selectedPropertyId === item.id }"
          @click="selectProperty(item)"
        >
          <p class="building-icon">
            {{ getBuildingEmoji(lastFetchedBuildingType) }} <strong>{{ item.buildingName }}</strong>
          </p>
          <p>{{ item.emdName }} · {{ item.roadName }}</p>
        </div>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="pageNo === 1">이전</button>
        <span>페이지 {{ pageNo }}</span>
        <button @click="nextPage" :disabled="!hasNext">다음</button>
      </div>
    </div>

    <!-- ✅ 선택된 매물 상세 사이드바 (실거래가 표시) -->
    <div class="detail-sidebar" v-if="selectedPropertyId">
      <div class="detail-content">
        <div class="detail-header">
          <h2>
            {{ getBuildingEmoji(lastFetchedBuildingType) }} {{ selectedProperty?.buildingName }}
          </h2>
          <p class="property-address">
            {{ selectedProperty?.emdName }} · {{ selectedProperty?.roadName }}
          </p>
        </div>

        <div class="deals-section">
          <h3>실거래가 내역</h3>

          <div v-if="!houseDeals || houseDeals.length === 0" class="no-deals">
            실거래가 데이터가 없습니다.
          </div>

          <div class="deals-list" v-else>
            <div class="deal-item" v-for="deal in houseDeals || []" :key="deal.id">
              <div class="deal-main">
                <div class="deal-price">
                  <span class="deal-type">{{
                    getDealType(deal.dealAmount, deal.monthlyRent)
                  }}</span>
                  <span class="price">{{ formatDealInfo(deal.dealAmount, deal.monthlyRent) }}</span>
                </div>
                <div class="deal-date">
                  {{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}
                </div>
              </div>

              <div class="deal-details">
                <div class="area-info">
                  <span class="area">{{ formatArea(deal.exclusiveArea) }}</span>
                  <span class="floor">{{ deal.floor }}층</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="kakao-map"></div>

    <!-- 토스트 알림 -->
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import axios from 'axios'

// ✅ 모든 반응형 상태 정의
const markers = ref([])
const selectedPropertyId = ref(null)
const buildingType = ref('')
const sido = ref('')
const gugun = ref('')
const dong = ref('')
const sidoList = ref([])
const gugunList = ref([])
const dongList = ref([])
const propertyList = ref([])
const pageNo = ref(1)
const hasNext = ref(false)
const pageSize = 10
const loading = ref(false)
const toastMessage = ref('')
const lastFetchedBuildingType = ref('')
const houseDeals = ref([])
const selectedProperty = ref(null)

const { proxy } = getCurrentInstance() || {}
const map = ref(null)

const typeMap = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  OFFICETEL: 'officetel',
}

const emojiMap = {
  APARTMENT: '🏢',
  VILLA: '🏘️',
  OFFICETEL: '🏙️',
}

const getBuildingEmoji = (type) => emojiMap[type] || '🏠'

// ✅ 실거래가 데이터 포맷팅 함수들
const formatPrice = (amount) => {
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000)
    const remain = amount % 10000
    return remain > 0 ? `${eok}억 ${remain.toLocaleString()}만` : `${eok}억`
  }
  return `${amount.toLocaleString()}만`
}

const formatDate = (year, month, day) => {
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
}

const formatArea = (area) => {
  return `${area}㎡ (${(area * 0.3025).toFixed(1)}평)`
}

const getDealType = (dealAmount, monthlyRent) => {
  if (monthlyRent > 0) {
    return dealAmount > 0 ? '전세' : '월세'
  }
  return '매매'
}

const formatDealInfo = (dealAmount, monthlyRent) => {
  const type = getDealType(dealAmount, monthlyRent)
  if (type === '월세') {
    return `${formatPrice(dealAmount)}/${monthlyRent}만`
  }
  return formatPrice(dealAmount)
}

const fetchProperties = async () => {
  loading.value = true
  toastMessage.value = ''
  selectedPropertyId.value = null

  clearAllMarkers()

  const typeParam = typeMap[buildingType.value]
  const queryParams = {}

  if (gugun.value) {
    queryParams.sgg = gugun.value.substring(0, 5)
  }

  if (dong.value) {
    queryParams.emd = dong.value.substring(dong.value.length - 5)
  }

  const url = `/v1/houseinfo/type/${typeParam}`
  const fullQuery = new URLSearchParams(queryParams).toString()
  console.log('📦 [요청 전송]', `${url}?${fullQuery}`)
  console.log('📌 [요청 파라미터]', queryParams)

  try {
    const res = await axios.get(url, { params: queryParams })
    console.log('✅ [응답 수신]', res.data)

    const result = res.data.result
    propertyList.value = result.content
    hasNext.value = result.hasNext

    lastFetchedBuildingType.value = buildingType.value
    renderMarkersAndCenterMap(result.content)
    showToast('매물 조회 완료!')
  } catch (err) {
    console.error('❌ [조회 실패]', err)
    console.error('❌ [에러 상세]', err.response?.data || err.message)
    showToast('조회 실패: 서버 오류', true)
  } finally {
    loading.value = false
  }
}

const clearAllMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null))
  markers.value = []
}

const fetchHouseDeals = async (propertyId) => {
  const url = `/v1/housedeal/${propertyId}`
  const queryParams = {
    buildingType: lastFetchedBuildingType.value || buildingType.value,
  }

  console.log('🏠 [실거래가 요청 전송]', `${url}?${new URLSearchParams(queryParams).toString()}`)
  console.log('📌 [매물 ID]', propertyId)
  console.log('📌 [건물 유형]', queryParams.buildingType)

  try {
    const res = await axios.get(url, { params: queryParams })
    console.log('✅ [실거래가 응답 수신]', res.data)

    if (res.data.isSuccess && res.data.result) {
      houseDeals.value = res.data.result.content
      showToast('실거래가 조회 완료!')
    }
  } catch (err) {
    console.error('❌ [실거래가 조회 실패]', err)
    console.error('❌ [실거래가 에러 상세]', err.response?.data || err.message)
    if (err.response?.data) {
      console.error('❌ [서버 에러 메시지]', JSON.stringify(err.response.data, null, 2))
    }
  }
}

const nextPage = () => {
  if (hasNext.value) {
    pageNo.value++
    fetchProperties()
  }
}

const prevPage = () => {
  if (pageNo.value > 1) {
    pageNo.value--
    fetchProperties()
  }
}

const showToast = (msg, isError = false) => {
  toastMessage.value = msg
  setTimeout(() => (toastMessage.value = ''), 3000)
}

const fetchSido = async () => {
  const res = await fetch('/api/region/sido')
  sidoList.value = await res.json()
}

const fetchGugun = async (sidoCode) => {
  const res = await fetch(`/api/region/gugun?sidoCode=${sidoCode}`)
  gugunList.value = (await res.json()).map((item) => ({ code: item.code, name: item.name }))
  gugun.value = ''
  dongList.value = []
  dong.value = ''
}

const fetchDong = async (sidoCode, gugunCode) => {
  const res = await fetch(`/api/region/dong?sidoCode=${sidoCode}&gugunCode=${gugunCode}`)
  dongList.value = (await res.json()).map((item) => ({ code: item.code, name: item.name }))
  dong.value = ''
}

const selectProperty = (property) => {
  selectedPropertyId.value = property.id
  selectedProperty.value = property
  const latlng = new kakao.maps.LatLng(property.latitude, property.longitude)
  map.value.setCenter(latlng)
  map.value.setLevel(3)

  fetchHouseDeals(property.id)
}

const renderMarkersAndCenterMap = (propertyList) => {
  if (!map.value || propertyList.length === 0) return

  const bounds = new kakao.maps.LatLngBounds()

  propertyList.forEach((property) => {
    const latlng = new kakao.maps.LatLng(property.latitude, property.longitude)

    const marker = new kakao.maps.Marker({
      map: map.value,
      position: latlng,
    })

    marker.setMap(map.value)

    kakao.maps.event.addListener(marker, 'click', () => {
      selectedPropertyId.value = property.id
      selectedProperty.value = property
      fetchHouseDeals(property.id)
    })

    markers.value.push(marker)
    bounds.extend(latlng)
  })

  map.value.setBounds(bounds)
}

watch(sido, (newSido) => newSido && fetchGugun(newSido))
watch(gugun, (newGugun) => sido.value && newGugun && fetchDong(sido.value, newGugun))

onMounted(() => {
  fetchSido()

  if (proxy && proxy.$loadKakaoMapSDK) {
    proxy.$loadKakaoMapSDK().then((kakao) => {
      const container = document.getElementById('kakao-map')
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      }
      map.value = new kakao.maps.Map(container, options)
      const mapTypeControl = new kakao.maps.MapTypeControl()
      const zoomControl = new kakao.maps.ZoomControl()
      map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)
      map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
    })
  } else {
    console.error('❌ Kakao Map SDK 로드 함수를 찾을 수 없습니다.')
  }
})
</script>

<style scoped>
.map-container {
  display: flex;
  height: 100vh;
  position: relative;
}

.region-select-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
  border-radius: 0;
}

.region-select {
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  min-width: 140px;
}

.search-button {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}

.search-button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.spinner {
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.property-sidebar {
  width: 360px;
  background: #f8fafc;
  padding: 20px;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  height: calc(100vh - 70px);
  margin-top: 70px;
  display: flex;
  flex-direction: column;
}

.property-list {
  flex-grow: 1;
  overflow-y: auto;
}

.property-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 16px;
  font-size: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
}

.property-item:hover {
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.building-icon {
  font-size: 16px;
  margin-bottom: 4px;
}

.no-result {
  text-align: center;
  color: #6b7280;
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.pagination button {
  padding: 8px 16px;
  border-radius: 6px;
  background: #e5e7eb;
  font-weight: 500;
}

.pagination button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

#kakao-map {
  flex: 1;
  height: 100%;
}

.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 9999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.property-item.selected {
  border-color: #3b82f6;
  background-color: #eef2ff;
}

.detail-sidebar {
  position: fixed;
  right: 0;
  margin-top: 70px;
  height: calc(100vh - 70px);
  width: 400px;
  background: white;
  border-left: 1px solid #e5e7eb;
  padding: 0;
  overflow-y: auto;
  z-index: 11;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.detail-content {
  padding: 20px;
  font-size: 14px;
  color: #1f2937;
}

.detail-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.detail-header h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #111827;
}

.property-address {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.deals-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
}

.no-deals {
  text-align: center;
  color: #6b7280;
  padding: 40px 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.deals-list {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
}

.deal-item {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.deal-item:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
}

.deal-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.deal-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.deal-type {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.deal-date {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.deal-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.area-info {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #4b5563;
}

.area {
  font-weight: 500;
}

.floor {
  color: #6b7280;
}
</style>
