export type MassiveTicker = {
  ticker: string
  name: string
  market: string
  locale: string
  currency_symbol?: string
  currency_name?: string
  base_currency_symbol?: string
  base_currency_name?: string
  active: boolean
}

export type MassiveTickersResponse = {
  status: string
  results: MassiveTicker[]
  count: number
  next_url?: string
  request_id?: string
}

// Aggregate types
export type MassiveAggregate = {
  v: number    // volume
  vw: number   // volume weighted average price
  o: number    // open price
  c: number    // close price
  h: number    // high price
  l: number    // low price
  t: number    // timestamp (milliseconds)
  n: number    // number of transactions
}

export type MassiveAggregatesResponse = {
  ticker: string
  status: string
  adjusted: boolean
  queryCount: number
  resultsCount: number
  results: MassiveAggregate[]
  next_url?: string
  request_id?: string
}

export type CurrencyPair = {
  ticker: string
  name: string
  currency_symbol?: string
  currency_name?: string
  base_currency_symbol?: string
  base_currency_name?: string
}

export type CurrencyFlags = {
  baseFlag: string
  quoteFlag: string
  baseCurrency: string
  quoteCurrency: string
}

export type PriceChange = {
  value: number
  percentage: number
}


export type DateRange = {
  from: string
  to: string
  multiplier: number
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month'
}

export type Timeframe = '15M' | '1H' | '1D' | '1W' | '1M'

export type TimeframeOption = {
  label: string
  value: Timeframe
}

export type FormatPriceChangeResult = {
  value: string
  colorClass: string
  sign: string
}

export type CountryCode = string

export type CurrencyToCountryMap = {
  [key: string]: CountryCode
}

