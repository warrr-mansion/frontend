<template>
  <div
    @click="$emit('click', property)"
    :style="{
      background: selected ? '#eef2ff' : 'white',
      border: `1px solid ${selected ? '#3b82f6' : '#e5e7eb'}`,
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
      {{ getBuildingEmoji(buildingType) }}
      <strong>{{ property.buildingName }}</strong>
    </p>
    <p>{{ property.emdName }} · {{ property.roadName }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  property: Object,
  selected: Boolean,
  buildingType: String,
})

const emit = defineEmits(['click'])

const emojiMap = {
  APARTMENT: '🏢',
  VILLA: '🏘️',
  OFFICETEL: '🏙️',
}

const getBuildingEmoji = (type) => emojiMap[type] || '🏠'
</script>
