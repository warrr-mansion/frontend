<template>
  <div class="map-container">
    <div id="kakao-map"></div>
    <div id="maplevel" class="map-level-display"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

// 인스턴스 가져오기
const { proxy } = getCurrentInstance()
const map = ref(null)

// 지도 레벨을 표시하는 함수
function displayLevel() {
  const levelEl = document.getElementById('maplevel')
  if (levelEl && map.value) {
    levelEl.innerHTML = '현재 지도 레벨은 ' + map.value.getLevel() + ' 레벨 입니다.'
  }
}

onMounted(() => {
  // 카카오맵 SDK 로드 및 지도 초기화
  proxy
    .$loadKakaoMapSDK()
    .then((kakao) => {
      console.log('카카오맵 SDK 로드 완료')

      // 지도를 표시할 div
      const container = document.getElementById('kakao-map')
      if (!container) {
        console.error('지도 컨테이너를 찾을 수 없습니다.')
        return
      }

      // 지도 옵션
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
        level: 3,
      }

      try {
        // 지도 생성
        map.value = new kakao.maps.Map(container, options)
        console.log('지도 생성 성공', map.value)

        // 지도 타입 컨트롤러 생성 (일반 지도, 스카이뷰 전환)
        const mapTypeControl = new kakao.maps.MapTypeControl()
        map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)

        // 지도 확대 축소를 제어하는 줌 컨트롤 생성
        const zoomControl = new kakao.maps.ZoomControl()
        map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: options.center,
        })
        marker.setMap(map.value)

        // 지도 레벨 표시
        displayLevel()

        // 지도 레벨 변경 이벤트 리스너 등록
        kakao.maps.event.addListener(map.value, 'zoom_changed', displayLevel)
      } catch (error) {
        console.error('지도 생성 중 오류 발생:', error)
      }
    })
    .catch((error) => {
      console.error('카카오맵 SDK 로드 실패:', error)
    })
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  /* 최소 높이를 제거하고 100%로 설정하여 부모 컨테이너(main-content)를 가득 채우도록 함 */
  display: flex;
  flex: 1;
}

#kakao-map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* 최소 높이 제거하고 100%로 설정 */
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
