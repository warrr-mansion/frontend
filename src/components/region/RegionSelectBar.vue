<template>
  <div class="map-topbar">
    <!-- 각 드롭다운 -->
    <select v-model="localBuildingType" :style="selectStyle">
      <option disabled value="">건물 유형 선택</option>
      <option value="APARTMENT">아파트</option>
      <option value="VILLA">빌라</option>
      <option value="OFFICETEL">오피스텔</option>
    </select>

    <select v-model="localSido" :style="selectStyle">
      <option disabled value="">시도 선택</option>
      <option v-for="item in sidoList" :key="item.code" :value="item.code">
        {{ item.name }}
      </option>
    </select>

    <select v-model="localGugun" :disabled="!localSido" :style="selectStyle">
      <option disabled value="">구군 선택</option>
      <option v-for="item in gugunList" :key="item.code" :value="item.code">
        {{ item.name }}
      </option>
    </select>

    <select v-model="localDong" :disabled="!localGugun" :style="selectStyle">
      <option disabled value="">읍면동 선택</option>
      <option v-for="item in dongList" :key="item.code" :value="item.code">
        {{ item.name }}
      </option>
    </select>

    <button @click="$emit('search')" :disabled="!localBuildingType" :style="buttonStyle">
      조회
    </button>

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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  buildingType: String,
  sido: String,
  gugun: String,
  dong: String,
  sidoList: Array,
  gugunList: Array,
  dongList: Array,
  loading: Boolean,
})

const emit = defineEmits([
  'update:buildingType',
  'update:sido',
  'update:gugun',
  'update:dong',
  'search',
])

const localBuildingType = computed({
  get: () => props.buildingType,
  set: (val) => emit('update:buildingType', val),
})

const localSido = computed({
  get: () => props.sido,
  set: (val) => emit('update:sido', val),
})

const localGugun = computed({
  get: () => props.gugun,
  set: (val) => emit('update:gugun', val),
})

const localDong = computed({
  get: () => props.dong,
  set: (val) => emit('update:dong', val),
})

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
</script>
