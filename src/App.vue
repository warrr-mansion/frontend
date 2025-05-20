<template>
  <AppHeader />

  <div id="map" style="width: 100%; height: 400px; margin: 20px 0"></div>

  <ExtraLibraryTestVue />
  <AppFooter />
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue'

import ExtraLibraryTestVue from '@/views/extra/ExtraLibraryTestVue.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import MemberRegistForm from './views/member/MemberRegistForm.vue'
import MemberDetail from './views/member/MemberDetail.vue'
import MemberList from './views/member/MemberList.vue'
import MemberModifyForm from './views/member/MemberModifyForm.vue'
import CommonError from './views/error/CommonError.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import LoginForm from './views/member/LoginForm.vue'

const { proxy } = getCurrentInstance()

onMounted(() => {
  proxy.$loadKakaoMapSDK().then((kakao) => {
    const container = document.getElementById('map')
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
      level: 3,
    }
    new kakao.maps.Map(container, options)
  })
})
</script>

<style scoped></style>
