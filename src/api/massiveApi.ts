import apiClient from './axios'
import type {
  MassiveTickersResponse,
  MassiveAggregatesResponse
} from '../types'

/**
 * Get all available forex tickers
 * Endpoint: GET /v3/reference/tickers
 * Documentation: https://massive.com/docs/api/llms/rest/stocks/tickers/all-tickers
 */
export async function getForexTickers(limit: number = 1000): Promise<MassiveTickersResponse> {
  try {
    const response = await apiClient.get<MassiveTickersResponse>('/v3/reference/tickers', {
      params: {
        market: 'fx',
        active: true,
        limit
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching forex tickers:', error)
    throw error
  }
}

/**
 * Get aggregate bars (historical OHLC data) for a forex ticker
 * Endpoint: GET /v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}
 * Documentation: https://massive.com/docs/api/llms/rest/stocks/aggregates/custom-bars
 */
export async function getAggregates(
  ticker: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string
): Promise<MassiveAggregatesResponse> {
  try {
    const response = await apiClient.get<MassiveAggregatesResponse>(
      `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`,
      {
        params: {
          adjusted: true,
          sort: 'asc'
        }
      }
    )
    
    return response.data
  } catch (error) {
    console.error('Error fetching aggregates:', error)
    throw error
  }
}

