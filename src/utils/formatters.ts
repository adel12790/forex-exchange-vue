import type { FormatPriceChangeResult } from '../types'

/**
 * Format a price with appropriate decimal places
 */
export function formatPrice(price: number | null | undefined, decimals: number = 6): string {
  if (price === null || price === undefined) return '0.000000'
  return price.toFixed(decimals)
}

/**
 * Format a percentage value
 */
export function formatPercentage(percent: number | null | undefined): string {
  if (percent === null || percent === undefined) return '0.00%'
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(6)}%`
}

/**
 * Format a price change value with appropriate styling
 */
export function formatPriceChange(change: number | null | undefined): FormatPriceChangeResult {
  if (change === null || change === undefined) {
    return {
      value: '0.000000',
      colorClass: 'text-gray-500',
      sign: ''
    }
  }
  
  const sign = change >= 0 ? '+' : ''
  const colorClass = change >= 0 ? 'text-success-500' : 'text-red-500'
  
  return {
    value: Math.abs(change).toFixed(6),
    colorClass,
    sign
  }
}

/**
 * Format a date for API requests
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

