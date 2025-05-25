<template>
  <div :style="{ display: 'flex', height: '100vh', position: 'relative' }">
    <!-- 지역 선택 바 -->
    <div
      :style="{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        background: 'white',
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        zIndex: 10,
      }"
    >
      <select v-model="buildingType" :style="selectStyle">
        <option disabled value="">건물 유형 선택</option>
        <option value="APARTMENT">아파트</option>
        <option value="VILLA">빌라</option>
        <option value="OFFICETEL">오피스텔</option>
      </select>

      <select v-model="sido" :style="selectStyle">
        <option disabled value="">시도 선택</option>
        <option v-for="item in sidoList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <select v-model="gugun" :disabled="!sido" :style="selectStyle">
        <option disabled value="">구군 선택</option>
        <option v-for="item in gugunList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <select v-model="dong" :disabled="!gugun" :style="selectStyle">
        <option disabled value="">읍면동 선택</option>
        <option v-for="item in dongList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <button @click="fetchProperties" :disabled="!buildingType" :style="buttonStyle">조회</button>

      <div
        v-if="loading"
        :style="{
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          animation: 'spin 0.7s linear infinite',
        }"
      ></div>
    </div>

    <!-- 매물 목록 -->
    <div
      :style="{
        width: '360px',
        background: '#f8fafc',
        padding: '20px',
        borderLeft: '1px solid #e5e7eb',
        overflowY: 'auto',
        height: 'calc(100vh - 70px)',
        marginTop: '70px',
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <div :style="{ flexGrow: 1, overflowY: 'auto' }">
        <div
          v-if="(!propertyList || propertyList.length === 0) && !loading"
          :style="{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }"
        >
          조회된 매물이 없습니다.
        </div>

        <div
          v-for="item in propertyList || []"
          :key="item.id"
          @click="selectProperty(item)"
          :style="{
            background: selectedPropertyId === item.id ? '#eef2ff' : 'white',
            border: `1px solid ${selectedPropertyId === item.id ? '#3b82f6' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '16px',
            fontSize: '14px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }"
        >
          <p :style="{ fontSize: '16px', marginBottom: '4px' }">
            {{ getBuildingEmoji(lastFetchedBuildingType) }} <strong>{{ item.buildingName }}</strong>
          </p>
          <p>{{ item.emdName }} · {{ item.roadName }}</p>
        </div>
      </div>

      <div
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
        }"
      >
        <button @click="prevPage" :disabled="pageNo === 1" :style="paginationButtonStyle">
          이전
        </button>
        <span>페이지 {{ pageNo }}</span>
        <button @click="nextPage" :disabled="!hasNext" :style="paginationButtonStyle">다음</button>
      </div>
    </div>

    <!-- 매물 상세 정보 -->
    <div
      v-if="selectedPropertyId"
      :style="{
        right: 0,
        height: 'calc(100vh - 70px)',
        width: '400px',
        background: 'white',
        borderLeft: '1px solid #e5e7eb',
        marginTop: '70px',
        padding: 0,
        overflowY: 'auto',
        zIndex: 11,
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
      }"
    >
      <div :style="{ padding: '20px', fontSize: '14px', color: '#1f2937' }">
        <div
          :style="{
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '16px',
            marginBottom: '20px',
          }"
        >
          <h2
            :style="{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px', color: '#111827' }"
          >
            {{ getBuildingEmoji(lastFetchedBuildingType) }} {{ selectedProperty?.buildingName }}
          </h2>
          <p :style="{ color: '#6b7280', fontSize: '14px', margin: 0 }">
            {{ selectedProperty?.emdName }} · {{ selectedProperty?.roadName }}
          </p>
        </div>

        <div>
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
              v-for="deal in filteredDeals || []"
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
                    {{ getDealType(deal) }}
                  </span>
                  <span :style="{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }">
                    {{ formatDealInfo(deal.dealAmount, deal.monthlyRent) }}
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
    </div>

    <!-- 카카오 맵 -->
    <div id="kakao-map" :style="{ flex: 1, height: '100%' }"></div>

    <!-- 토스트 -->
    <div
      v-if="toastMessage"
      :style="{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1f2937',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 500,
        zIndex: 9999,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      }"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance, computed } from 'vue'
import axios from 'axios'

const buildingType = ref('')
const sido = ref('')
const gugun = ref('')
const dong = ref('')
const sidoList = ref([])
const gugunList = ref([])
const dongList = ref([])
const loading = ref(false)
const toastMessage = ref('')

const selectStyle = {
  padding: '10px 14px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  backgroundColor: '#f9fafb',
  minWidth: '140px',
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const paginationButtonStyle = {
  padding: '8px 16px',
  borderRadius: '6px',
  background: '#e5e7eb',
  fontWeight: 500,
  cursor: 'pointer',
}

const checkboxLabelStyle = {
  fontSize: '13px',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
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

const dealTypes = ref(['전세', '월세', '매매'])

const contractTypeMap = {
  전세: 'JEONSE',
  월세: 'MONTHLY',
  매매: 'SALE',
}

const filteredDeals = computed(() =>
  houseDeals.value.filter((deal) => {
    return dealTypes.value.some((type) => deal.contractType === contractTypeMap[type])
  }),
)

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

const getDealType = (deal) => {
  const map = {
    JEONSE: '전세',
    MONTHLY: '월세',
    SALE: '매매',
  }
  return map[deal.contractType] || '기타'
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
  console.log('📌 [건물 유형]', buildingParam) // ✅ 이걸로 충분함

  try {
    const res = await axios.get(url)
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

<style scoped></style>
