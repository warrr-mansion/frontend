<template>
  <div class="d-flex justify-content-end">
    <select class="form-select w-25" name="key" v-model="localCondition.key">
      <option
        :value="option.value"
        v-for="option in options"
        :key="option.value"
        :disabled="option.key === ''"
        :selected="localCondition.key == option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <input type="text" class="form-control w-25" v-model="localCondition.word" />
    <button type="submit" class="btn btn-primary" @click.prevent="updateCondition">검색</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ options: Array, condition: Object })
const emit = defineEmits(['updateCondition'])
// 검색 조건은 수정될 수 있기 때문에 props의 내용을 복사해서 localCondition으로 처리 --> 실제 사용
const localCondition = ref({ ...props.condition })
const updateCondition = () => {
  localCondition.value.currentPage = 1
  console.log('update condition', localCondition.value)
  emit('updateCondition', localCondition.value)
}
</script>

<style lang="scss" scoped></style>
