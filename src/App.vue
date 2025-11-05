<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-2">Forex Exchange</h1>
        <p class="text-xl text-gray-600">Check out the current price for a currency pair</p>
      </header>

      <!-- Error Message -->
      <ErrorMessage
        v-if="forexStore.error"
        :message="forexStore.error"
        @dismiss="forexStore.clearError()"
        class="mb-6"
      />

      <!-- Currency Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Currency Selectors -->
        <div class="lg:col-span-3 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              From Currency
            </label>
            <CurrencyDropdown
              v-model="forexStore.selectedBaseCurrency"
              :currencies="availableCurrencies"
              @update:model-value="handleBaseCurrencyChange"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              To Currency
            </label>
            <CurrencyDropdown
              v-model="forexStore.selectedQuoteCurrency"
              :currencies="availableCurrencies"
              @update:model-value="handleQuoteCurrencyChange"
            />
          </div>
        </div>

        <!-- Exchange Card -->
        <div class="lg:col-span-9">
          <LoadingSpinner
            v-if="forexStore.loading && !forexStore.historicalData.length"
            message="Loading forex data..."
          />
          
          <ExchangeCard
            v-else
            :ticker="forexStore.selectedPair"
            :current-price="forexStore.currentPriceValue"
            :price-change="forexStore.priceChange"
            :chart-data="forexStore.historicalData"
            :selected-timeframe="forexStore.selectedTimeframe"
            :exchange="forexStore.exchanges[0]"
            @timeframe-change="handleTimeframeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useForexStore } from './stores/forexStore'
import CurrencyDropdown from './components/CurrencyDropdown.vue'
import ExchangeCard from './components/ExchangeCard.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import type { Timeframe } from './types'

const forexStore = useForexStore()

const defaultCurrencies: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'CNY', 'INR']

const availableCurrencies = computed<string[]>(() => {
  if (forexStore.uniqueCurrencies.length > 0) {
    return forexStore.uniqueCurrencies
  }
  return defaultCurrencies
})

onMounted(async () => {
  try {
    await forexStore.fetchAvailablePairs()
    
    if (forexStore.uniqueCurrencies.length === 0) {
      console.warn('No currencies loaded from API, using defaults')
    }
    
    await forexStore.fetchHistoricalData()
  } catch (error) {
    console.error('Error initializing app:', error)
  }
})

async function handleBaseCurrencyChange(currency: string): Promise<void> {
  await forexStore.setSelectedPair(currency, forexStore.selectedQuoteCurrency)
}

async function handleQuoteCurrencyChange(currency: string): Promise<void> {
  await forexStore.setSelectedPair(forexStore.selectedBaseCurrency, currency)
}

async function handleTimeframeChange(timeframe: Timeframe): Promise<void> {
  await forexStore.setTimeframe(timeframe)
}
</script>

