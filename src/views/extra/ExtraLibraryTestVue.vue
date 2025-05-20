<template>
  <div class="container">
    <div id="map" style="width: 100%; height: 600px" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 객체를 컴포넌트 전체에서 접근 가능하도록 ref로 만듦
const map = ref(null)
const mapContainer = ref(null)
const mapTypeControl = ref(null)
const zoomControl = ref(null)
const marker = ref(null)

// 지도 레벨을 표시하는 함수
function displayLevel() {
  const levelEl = document.getElementById('maplevel')
  levelEl.innerHTML = '현재 지도 레벨은 ' + map.value.getLevel() + ' 레벨 입니다.'
}

onMounted(() => {
  // Dom이 완전히 렌더링된 후 실행되도록 약간의 딜레이 추가
  setTimeout(() => {
    // 지도 옵션 설정
    const mapOption = {
      center: new window.kakao.maps.LatLng(35.09552, 128.855786), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    }

    // 지도 생성 및 map ref에 할당
    map.value = new window.kakao.maps.Map(mapContainer.value, mapOption)

    // 지도 컨트롤러 생성
    mapTypeControl.value = new window.kakao.maps.MapTypeControl()

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.value.addControl(mapTypeControl.value, window.kakao.maps.ControlPosition.TOPRIGHT)

    // 지도 확대 축소를 제어하는 줌 컨트롤 생성
    zoomControl.value = new window.kakao.maps.ZoomControl() // 수정: 'z'를 대문자 'Z'로 변경
    map.value.addControl(zoomControl.value, window.kakao.maps.ControlPosition.RIGHT) // 수정: 올바른 상수 사용

    // 마커 생성
    marker.value = new window.kakao.maps.Marker({
      position: mapOption.center,
    })

    marker.value.setMap(map.value)

    // 초기 지도 레벨 표시
    displayLevel()
  }, 100)
})

console.log(import.meta.env)
</script>

<style scoped>
.container {
  padding: 16px;
  font-family: 'Arial', sans-serif;
}
button {
  padding: 10px 16px;
  margin-right: 10px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background-color: #4caf50; /* 초록 버튼 */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #45a049;
}
button:active {
  transform: scale(0.97);
}
#maplevel {
  font-size: 14px;
  margin-left: 10px;
  color: #333;
}
</style>
