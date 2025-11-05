<template>
  <div class="flex items-center justify-center gap-2 bg-white p-2 rounded-lg shadow-sm">
    <button
      v-for="timeframe in timeframes"
      :key="timeframe.value"
      @click="selectTimeframe(timeframe.value)"
      :class="[
        'px-6 py-2 rounded-md font-medium text-sm transition-all duration-200',
        modelValue === timeframe.value
          ? 'bg-primary-100 text-primary-700 shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      ]"
    >
      {{ timeframe.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Timeframe, TimeframeOption } from '../types'

type Props = {
  modelValue: Timeframe
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Timeframe]
}>()

const timeframes: TimeframeOption[] = [
  { label: '15M', value: '15M' },
  { label: '1H', value: '1H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' }
]

function selectTimeframe(value: Timeframe): void {
  emit('update:modelValue', value)
}
</script>

