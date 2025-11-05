import dayjs, { type Dayjs } from 'dayjs'
import type { DateRange, Timeframe } from '../types'

/**
 * Calculate date range for a given timeframe
 */
export function calculateDateRange(timeframe: Timeframe): DateRange {
  const now = dayjs()
  let from: Dayjs
  let multiplier: number
  let timespan: DateRange['timespan']
  
  switch (timeframe) {
    case '15M':
      from = now.subtract(1, 'day')
      multiplier = 15
      timespan = 'minute'
      break
    
    case '1H':
      from = now.subtract(7, 'day')
      multiplier = 1
      timespan = 'hour'
      break
    
    case '1D':
      from = now.subtract(30, 'day')
      multiplier = 1
      timespan = 'day'
      break
    
    case '1W':
      from = now.subtract(6, 'month')
      multiplier = 1
      timespan = 'week'
      break
    
    case '1M':
      from = now.subtract(2, 'year')
      multiplier = 1
      timespan = 'month'
      break
    
    default:
      from = now.subtract(1, 'day')
      multiplier = 15
      timespan = 'minute'
  }
  
  return {
    from: from.format('YYYY-MM-DD'),
    to: now.format('YYYY-MM-DD'),
    multiplier,
    timespan
  }
}

/**
 * Format timestamp for chart display
 */
export function formatChartDate(timestamp: number, timeframe: Timeframe): string {
  const date = dayjs(timestamp)
  
  switch (timeframe) {
    case '15M':
    case '1H':
      return date.format('MMM D, HH:mm')
    
    case '1D':
    case '1W':
      return date.format('MMM D')
    
    case '1M':
      return date.format('MMM YYYY')
    
    default:
      return date.format('MMM D, HH:mm')
  }
}

