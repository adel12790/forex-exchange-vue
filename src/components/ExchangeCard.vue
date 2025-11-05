<template>
  <div class="bg-white rounded-2xl shadow-lg p-8">
    <!-- Header with flags and exchange name -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <!-- Currency flags -->
        <div class="flex items-center -space-x-2">
          <img
            v-if="baseFlag"
            :src="baseFlag"
            :alt="baseCurrency"
            class="h-10 w-14 object-cover rounded-md shadow-md border-2 border-white"
            @error="handleImageError"
          />
          <img
            v-if="quoteFlag"
            :src="quoteFlag"
            :alt="quoteCurrency"
            class="h-10 w-14 object-cover rounded-md shadow-md border-2 border-white"
            @error="handleImageError"
          />
        </div>
        
        <!-- Currency pair -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900">
            {{ currencyPair }}
          </h2>
        </div>
      </div>
      
      <!-- Exchange badge -->
      <div class="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
        {{ exchange }}
      </div>
    </div>

    <!-- Price display -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <div class="text-5xl font-bold text-gray-900 mb-2">
          $ {{ formattedPrice }}
        </div>
        <div
          v-if="priceChange"
          :class="[
            'text-lg font-medium flex items-center gap-2',
            priceChangeColor
          ]"
        >
          <span>{{ priceChangeSign }}{{ Math.abs(priceChange.value).toFixed(6) }}</span>
          <span>({{ priceChangeSign }}{{ Math.abs(priceChange.percentage).toFixed(6) }}%)</span>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="mb-6">
      <PriceChart :data="chartData" :height="400" />
    </div>

    <!-- Timeframe tabs -->
    <TimeframeTabs
      :model-value="selectedTimeframe"
      @update:model-value="handleTimeframeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PriceChart from './PriceChart.vue'
import TimeframeTabs from './TimeframeTabs.vue'
import { formatPrice } from '../utils/formatters'
import { getCurrencyPairFlags, formatCurrencyPair } from '../utils/currencyFlags'
import type { PriceChange, MassiveAggregate, Timeframe } from '../types'

type Props = {
  ticker: string
  currentPrice?: number
  priceChange?: PriceChange
  chartData?: MassiveAggregate[]
  selectedTimeframe?: Timeframe
  exchange?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPrice: 0,
  priceChange: () => ({ value: 0, percentage: 0 }),
  chartData: () => [],
  selectedTimeframe: '15M',
  exchange: 'Forex.com'
})

const emit = defineEmits<{
  'timeframe-change': [timeframe: Timeframe]
}>()

const currencyPair = computed<string>(() => formatCurrencyPair(props.ticker))

const currencyFlags = computed(() => getCurrencyPairFlags(props.ticker))

const baseFlag = computed<string>(() => currencyFlags.value.baseFlag)
const quoteFlag = computed<string>(() => currencyFlags.value.quoteFlag)
const baseCurrency = computed<string>(() => currencyFlags.value.baseCurrency)
const quoteCurrency = computed<string>(() => currencyFlags.value.quoteCurrency)

const formattedPrice = computed<string>(() => formatPrice(props.currentPrice, 6))

const priceChangeColor = computed<string>(() => {
  if (props.priceChange && props.priceChange.value > 0) return 'text-success-500'
  if (props.priceChange && props.priceChange.value < 0) return 'text-red-500'
  return 'text-gray-500'
})

const priceChangeSign = computed<string>(() => {
  if (props.priceChange && props.priceChange.value > 0) return '+'
  if (props.priceChange && props.priceChange.value < 0) return ''
  return ''
})

function handleTimeframeChange(timeframe: Timeframe): void {
  emit('timeframe-change', timeframe)
}

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

