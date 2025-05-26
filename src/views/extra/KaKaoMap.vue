<template>
  <div class="map-page-layout">
    <!-- 지역 선택 바 -->
    <RegionSelectBar
      v-model:buildingType="buildingType"
      v-model:sido="sido"
      v-model:gugun="gugun"
      v-model:dong="dong"
      :sidoList="sidoList"
      :gugunList="gugunList"
      :dongList="dongList"
      :loading="loading"
      @search="searchProperties"
    />

    <div class="map-content">
      <!-- 매물 목록 전체 -->
      <div
        :style="{
          width: '360px',
          background: '#f8fafc',
          padding: '20px',
          borderLeft: '1px solid #e5e7eb',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }"
      >
        <!-- ✅ 목록만 스크롤 -->
        <div
          :style="{
            flexGrow: 1,
            overflowY: 'auto',
            paddingRight: '4px', // 스크롤바 가리지 않도록 여유
          }"
        >
          <div
            v-if="(!propertyList || propertyList.length === 0) && !loading"
            :style="{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }"
          >
            조회된 매물이 없습니다.
          </div>

          <PropertyCard
            v-for="item in propertyList"
            :key="item.id"
            :property="item"
            :buildingType="lastFetchedBuildingType"
            :selected="selectedPropertyId === item.id"
            @click="selectProperty"
          />
        </div>

        <!-- ✅ 이전/다음 버튼은 항상 아래 고정 -->
        <div
          :style="{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb',
          }"
        >
          <button @click="prevPage" :disabled="pageNo === 1" :style="paginationButtonStyle">
            이전
          </button>
          <span>페이지 {{ pageNo }}</span>
          <button @click="nextPage" :disabled="!hasNext" :style="paginationButtonStyle">
            다음
          </button>
        </div>
      </div>

      <!-- 상세 정보 패널 -->
      <transition name="slide-fade">
        <PropertyDetail
          v-if="selectedPropertyId"
          :property="selectedProperty"
          :buildingType="lastFetchedBuildingType"
          :houseDeals="houseDeals"
        />
      </transition>

      <!-- 리뷰 패널 -->
      <transition name="slide-fade">
        <PropertyReviewSidebar v-if="selectedPropertyId" :propertyId="selectedPropertyId" />
      </transition>

      <!-- 카카오 맵 -->
      <div id="kakao-map" :style="{ flex: 1, height: '100%' }"></div>
    </div>
    <!-- 토스트 -->
    <div v-if="toastMessage" class="toast-message">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance, computed } from 'vue'
import axios from 'axios'
import RegionSelectBar from '@/components/region/RegionSelectBar.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import PropertyDetail from '@/components/property/PropertyDetail.vue'
import PropertyReviewSidebar from '@/components/review/PropertyReviewSidebar.vue'

const buildingType = ref('')
const sido = ref('')
const gugun = ref('')
const dong = ref('')
const sidoList = ref([])
const gugunList = ref([])
const dongList = ref([])
const loading = ref(false)
const toastMessage = ref('')

const paginationButtonStyle = {
  padding: '8px 16px',
  borderRadius: '6px',
  background: '#e5e7eb',
  fontWeight: 500,
  cursor: 'pointer',
}

// ✅ 모든 반응형 상태 정의
const markers = ref([])
const selectedPropertyId = ref(null)

const propertyList = ref([])
const pageNo = ref(1)
const hasNext = ref(false)
const pageSize = 10

const lastFetchedBuildingType = ref('')
const houseDeals = ref([])
const selectedProperty = computed(() =>
  propertyList.value.find((p) => p.id === selectedPropertyId.value),
)

const { proxy } = getCurrentInstance() || {}
const map = ref(null)

const typeMap = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  OFFICETEL: 'officetel',
}

const fetchProperties = async (isNewSearch = false) => {
  loading.value = true
  toastMessage.value = ''
  selectedPropertyId.value = null

  clearAllMarkers()

  // 새로운 검색인 경우 페이지를 1로 초기화
  if (isNewSearch) {
    pageNo.value = 1
  }

  const typeParam = typeMap[buildingType.value]
  const queryParams = {
    page: pageNo.value, // ✅ 페이지 번호 추가
    size: pageSize, // ✅ 페이지 크기도 명시적으로 추가
  }

  if (gugun.value) {
    queryParams.sgg = gugun.value.substring(0, 5)
  }

  if (dong.value) {
    queryParams.emd = dong.value.substring(dong.value.length - 5)
  }

  const url = `/v1/houses/type/${typeParam}`
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
  const buildingParam = lastFetchedBuildingType.value || buildingType.value
  const url = `/v1/houses/${propertyId}/type/${buildingParam}/deals`

  console.log('🏠 [실거래가 요청 전송]', url)
  console.log('📌 [매물 ID]', propertyId)
  console.log('📌 [건물 유형]', buildingParam)
  console.log('📄 [페이지 번호]', pageNo.value)

  try {
    const res = await axios.get(url, {
      params: {
        page: pageNo.value,
      },
    })

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

// 2. 조회 버튼 클릭 시 호출할 함수 (새로운 검색)
const searchProperties = async () => {
  await fetchProperties(true) // isNewSearch = true
}

// 3. 페이지네이션 함수들 (기존 페이지 유지)
const nextPage = async () => {
  if (hasNext.value) {
    pageNo.value++
    await fetchProperties(false) // isNewSearch = false
  }
}

const prevPage = async () => {
  if (pageNo.value > 1) {
    pageNo.value--
    await fetchProperties(false) // isNewSearch = false
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
  const res = await fetch(`/api/region/sido/${sidoCode}/gugun`)
  gugunList.value = (await res.json()).map((item) => ({ code: item.code, name: item.name }))
  gugun.value = ''
  dongList.value = []
  dong.value = ''
}

const fetchDong = async (sidoCode, gugunCode) => {
  const res = await fetch(`/api/region/gugun/${gugunCode}/dong`)
  dongList.value = (await res.json()).map((item) => ({ code: item.code, name: item.name }))
  dong.value = ''
}

const selectProperty = (property) => {
  const isSameProperty = selectedPropertyId.value === property.id

  if (isSameProperty) {
    // 동일 매물 다시 클릭: 선택 해제 (사이드바 닫힘)
    selectedPropertyId.value = null
    selectedProperty.value = null
  } else {
    // 새 매물 선택: 상세 + 리뷰 열기
    selectedPropertyId.value = property.id
    selectedProperty.value = property

    const latlng = new kakao.maps.LatLng(property.latitude, property.longitude)
    map.value.setCenter(latlng)
    map.value.setLevel(3)

    fetchHouseDeals(property.id)
  }
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
.map-page-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px); /* 헤더 + 푸터 높이 제외 */
  overflow: hidden;
}

.map-topbar {
  flex-shrink: 0;
  background: white;
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.map-content {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden; /* 외부 스크롤 방지 */
}

.property-list {
  width: 360px;
  background: #f8fafc;
  padding: 20px;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
}

.property-detail {
  width: 400px;
  background: white;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
}

.map-container {
  flex: 1;
  height: 100%;
}

.toast-message {
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

/* 슬라이드 + 페이드 인/아웃 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
