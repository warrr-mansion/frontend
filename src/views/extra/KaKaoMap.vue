<template>
  <div class="map-container">
    <!-- 지역 선택 UI 추가 -->
    <div class="region-select-container">
      <!-- 시도 -->
      <select v-model="sido" class="region-select">
        <option disabled value="">시도 선택</option>
        <option v-if="sidoList.length === 0" disabled>불러오는 중...</option>
        <option v-for="item in sidoList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <!-- 구군 -->
      <select v-model="gugun" class="region-select" :disabled="sido === ''">
        <option disabled value="">구군 선택</option>
        <option v-if="gugunList.length === 0 && sido" disabled>불러오는 중...</option>
        <option v-else v-for="item in gugunList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <!-- 동 -->
      <select v-model="dong" class="region-select" :disabled="gugun === ''">
        <option disabled value="">읍면동 선택</option>
        <option v-if="dongList.length === 0 && gugun" disabled>불러오는 중...</option>
        <option v-for="item in dongList" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>
    </div>

    <!-- 지도 영역 -->
    <div id="kakao-map"></div>
    <div id="maplevel" class="map-level-display"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const map = ref(null)

// 지역 선택 상태
const sido = ref('')
const gugun = ref('')
const dong = ref('')
const sidoList = ref([])
const gugunList = ref([])
const dongList = ref([])

// 시도 목록 불러오기
const fetchSido = async () => {
  try {
    const res = await fetch('/api/region/sido')
    const data = await res.json()
    console.log('✅ 시도 응답:', data)
    sidoList.value = data // 그대로 넣어도 문제 없음!
  } catch (err) {
    console.error('시도 데이터 로드 실패:', err)
  }
}

// 구군 목록 불러오기
const fetchGugun = async (sidoCode) => {
  try {
    const res = await fetch(`/api/region/gugun?sidoCode=${sidoCode}`)
    const data = await res.json()
    console.log('✅ 구군 응답:', data)
    gugunList.value = data.map((item) => ({
      code: item.code, //
      name: item.name,
    }))
    gugun.value = ''
    dongList.value = []
    dong.value = ''
  } catch (err) {
    console.error('구군 데이터 로드 실패:', err)
  }
}

const fetchDong = async (sidoCode, gugunCode) => {
  try {
    const res = await fetch(`/api/region/dong?sidoCode=${sidoCode}&gugunCode=${gugunCode}`)
    const data = await res.json()
    console.log('✅ 동 응답:', data)

    dongList.value = data.map((item) => ({
      code: item.code,
      name: item.name,
    }))
    dong.value = ''
  } catch (err) {
    console.error('동 데이터 로드 실패:', err)
  }
}

// 시도/구군 선택 감시
watch(sido, (newSido) => {
  console.log('👉 시도 선택됨:', newSido)
  if (newSido) fetchGugun(newSido)
})

watch(gugun, (newGugun) => {
  if (sido.value && newGugun) {
    fetchDong(sido.value, newGugun)
  }
})

// 지도 로드 + 시도 초기화
onMounted(() => {
  fetchSido()

  proxy.$loadKakaoMapSDK().then((kakao) => {
    const container = document.getElementById('kakao-map')
    if (!container) return

    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    }

    map.value = new kakao.maps.Map(container, options)

    const mapTypeControl = new kakao.maps.MapTypeControl()
    map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)

    const zoomControl = new kakao.maps.ZoomControl()
    map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

    const marker = new kakao.maps.Marker({ position: options.center })
    marker.setMap(map.value)

    displayLevel()
    kakao.maps.event.addListener(map.value, 'zoom_changed', displayLevel)
  })
})

// 지도 레벨 표시 함수
function displayLevel() {
  const levelEl = document.getElementById('maplevel')
  if (levelEl && map.value) {
    levelEl.innerHTML = '현재 지도 레벨은 ' + map.value.getLevel() + ' 레벨 입니다.'
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh; /* 또는 고정 높이 */
  display: flex;
  flex-direction: column;
  position: relative;
}

#region-select-container,
.region-select-container {
  padding: 10px;
  background: white;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.region-select {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#kakao-map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.map-level-display {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
