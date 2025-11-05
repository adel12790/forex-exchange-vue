import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getForexTickers, getAggregates } from '../api/massiveApi'
import { calculateDateRange } from '../utils/dateHelpers'
import type { CurrencyPair, MassiveAggregate, PriceChange, Timeframe } from '../types'

export const useForexStore = defineStore('forex', () => {
  // State
  const availablePairs = ref<CurrencyPair[]>([])
  const selectedBaseCurrency = ref<string>('EUR')
  const selectedQuoteCurrency = ref<string>('USD')
  const currentPrice = ref<number | null>(null)
  const historicalData = ref<MassiveAggregate[]>([])
  const selectedTimeframe = ref<Timeframe>('15M')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const exchanges = ref<string[]>(['Forex.com']) 

  // Computed
  const selectedPair = computed<string>(() => {
    return `C:${selectedBaseCurrency.value}${selectedQuoteCurrency.value}`
  })

  const priceChange = computed<PriceChange>(() => {
    if (!historicalData.value || historicalData.value.length < 2) {
      return { value: 0, percentage: 0 }
    }

    const firstPrice = historicalData.value[0]?.c || 0
    const lastPrice = historicalData.value[historicalData.value.length - 1]?.c || 0
    const change = lastPrice - firstPrice
    const percentage = firstPrice !== 0 ? (change / firstPrice) * 100 : 0

    return {
      value: change,
      percentage
    }
  })

  const currentPriceValue = computed<number>(() => {
    if (historicalData.value && historicalData.value.length > 0) {
      return historicalData.value[historicalData.value.length - 1]?.c || 0
    }
    return currentPrice.value || 0
  })

  // Actions
  async function fetchAvailablePairs(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await getForexTickers(1000)
      
      if (response.results && Array.isArray(response.results)) {
        availablePairs.value = response.results
          .filter(ticker => ticker.ticker && ticker.ticker.startsWith('C:'))
          .map(ticker => ({
            ticker: ticker.ticker,
            name: ticker.name || ticker.ticker,
            currency_symbol: ticker.currency_symbol,
            currency_name: ticker.currency_name,
            base_currency_symbol: ticker.base_currency_symbol,
            base_currency_name: ticker.base_currency_name
          }))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available currency pairs'
      error.value = errorMessage
      console.error('Error fetching pairs:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchHistoricalData(ticker: string | null = null, timeframe: Timeframe | null = null): Promise<void> {
    const tickerToFetch = ticker || selectedPair.value
    const timeframeToUse = timeframe || selectedTimeframe.value

    loading.value = true
    error.value = null

    try {
      const { from, to, multiplier, timespan } = calculateDateRange(timeframeToUse)
      
      const response = await getAggregates(tickerToFetch, multiplier, timespan, from, to)
      
      if (response.results && Array.isArray(response.results)) {
        historicalData.value = response.results
        
        if (response.results.length > 0) {
          currentPrice.value = response.results[response.results.length - 1].c
        }
      } else {
        historicalData.value = []
        error.value = 'No data available for the selected timeframe'
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical data'
      error.value = errorMessage
      console.error('Error fetching historical data:', err)
      historicalData.value = []
    } finally {
      loading.value = false
    }
  }

  async function setSelectedPair(baseCurrency: string, quoteCurrency: string): Promise<void> {
    selectedBaseCurrency.value = baseCurrency
    selectedQuoteCurrency.value = quoteCurrency
    await fetchHistoricalData()
  }

  async function setTimeframe(timeframe: Timeframe): Promise<void> {
    selectedTimeframe.value = timeframe
    await fetchHistoricalData()
  }

  function clearError(): void {
    error.value = null
  }

  const uniqueCurrencies = computed<string[]>(() => {
    const currencies = new Set<string>()
    
    availablePairs.value.forEach(pair => {
      if (pair.ticker) {
        const pairStr = pair.ticker.replace('C:', '')
        if (pairStr.length === 6) {
          currencies.add(pairStr.substring(0, 3))
          currencies.add(pairStr.substring(3, 6))
        }
      }
    })
    
    return Array.from(currencies).sort()
  })

  const uniqueCurrencyNames = computed<Record<string, string>>(() => {
    const currencyMap: Record<string, string> = {}
    
    availablePairs.value.forEach(pair => {
      if (pair.base_currency_symbol && pair.base_currency_name) {
        currencyMap[pair.base_currency_symbol] = pair.base_currency_name
      }
      
      if (pair.currency_symbol && pair.currency_name) {
        currencyMap[pair.currency_symbol] = pair.currency_name
      }
    })
    
    return currencyMap
  })

  return {
    // State
    availablePairs,
    selectedBaseCurrency,
    selectedQuoteCurrency,
    currentPrice,
    historicalData,
    selectedTimeframe,
    loading,
    error,
    exchanges,
    
    // Computed
    selectedPair,
    priceChange,
    currentPriceValue,
    uniqueCurrencies,
    uniqueCurrencyNames,
    
    // Actions
    fetchAvailablePairs,
    fetchHistoricalData,
    setSelectedPair,
    setTimeframe,
    clearError
  }
})

