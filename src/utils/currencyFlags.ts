import type { CurrencyFlags, CurrencyToCountryMap } from '../types'
import countryCodes from './codes.json'

type CurrencyPairParsed = {
  base: string
  quote: string
}

/**
 * Extract currency codes from a forex pair ticker
 */
export function parseCurrencyPair(ticker: string): CurrencyPairParsed {
  if (!ticker) return { base: '', quote: '' }
  
  // Remove "C:" prefix if present
  const pair = ticker.replace(/^C:/, '')
  
  // Most forex pairs are 6 characters (3 for each currency)
  if (pair.length === 6) {
    return {
      base: pair.substring(0, 3),
      quote: pair.substring(3, 6)
    }
  }
  
  return { base: '', quote: '' }
}


const currencyToCountry: CurrencyToCountryMap = {
  'USD': 'us',
  'EUR': 'eu',
  'GBP': 'gb',
  'JPY': 'jp',
  'CHF': 'ch',
  'CAD': 'ca',
  'AUD': 'au',
  'NZD': 'nz',
  'CNY': 'cn',
  'INR': 'in',
  'MXN': 'mx',
  'BRL': 'br',
  'ZAR': 'za',
  'SGD': 'sg',
  'HKD': 'hk',
  'NOK': 'no',
  'SEK': 'se',
  'DKK': 'dk',
  'PLN': 'pl',
  'THB': 'th',
  'MYR': 'my',
  'IDR': 'id',
  'PHP': 'ph',
  'CZK': 'cz',
  'HUF': 'hu',
  'RUB': 'ru',
  'TRY': 'tr',
  'KRW': 'kr',
  'AED': 'ae',
  'SAR': 'sa',
  'ILS': 'il',
  'CLP': 'cl',
  'ARS': 'ar',
  'COP': 'co',
  'EGP': 'eg',
  'PKR': 'pk',
  'VND': 'vn',
  'RON': 'ro',
  'BGN': 'bg',
  'ISK': 'is',
  'HRK': 'hr',
  'UAH': 'ua',
  'QAR': 'qa',
  'KWD': 'kw',
  'BHD': 'bh',
  'OMR': 'om',
  'JOD': 'jo',
  'LBP': 'lb',
  'TWD': 'tw',
  'PEN': 'pe',
  'VES': 've',
  'UYU': 'uy',
  'PYG': 'py',
  'BOB': 'bo',
  'CRC': 'cr',
  'PAB': 'pa',
  'NIO': 'ni',
  'GTQ': 'gt',
  'HNL': 'hn',
  'DOP': 'do',
  'MAD': 'ma',
  'TND': 'tn',
  'JMD': 'jm',
  'TTD': 'tt',
  'BSD': 'bs',
  'BBD': 'bb',
  'BZD': 'bz',
  'XCD': 'ag',
  'FJD': 'fj',
  'NGN': 'ng',
  'GHS': 'gh',
  'KES': 'ke',
  'UGX': 'ug',
  'TZS': 'tz',
  'ETB': 'et',
  'AOA': 'ao',
  'MZN': 'mz',
  'ZMW': 'zm',
  'BWP': 'bw',
  'MWK': 'mw',
  'NAD': 'na',
  'SZL': 'sz',
  'LSL': 'ls',
  'MUR': 'mu',
  'SCR': 'sc',
  'MGA': 'mg',
  'RWF': 'rw',
  'BIF': 'bi',
  'DJF': 'dj',
  'KMF': 'km',
  'XAF': 'cm',
  'XOF': 'sn',
  'GEL': 'ge',
  'AMD': 'am',
  'AZN': 'az',
  'BYN': 'by',
  'KZT': 'kz',
  'UZS': 'uz',
  'KGS': 'kg',
  'TJS': 'tj',
  'TMT': 'tm',
  'AFN': 'af',
  'BDT': 'bd',
  'BTN': 'bt',
  'LKR': 'lk',
  'MVR': 'mv',
  'NPR': 'np',
  'LAK': 'la',
  'MMK': 'mm',
  'KHR': 'kh',
  'BND': 'bn',
  'MNT': 'mn',
  'MOP': 'mo',
  'KPW': 'kp',
  'IQD': 'iq',
  'IRR': 'ir',
  'SYP': 'sy',
  'YER': 'ye',
  'SDG': 'sd',
  'SSP': 'ss',
  'LYD': 'ly',
  'DZD': 'dz',
  'MRU': 'mr',
  'GMD': 'gm',
  'SLL': 'sl',
  'LRD': 'lr',
  'GNF': 'gn',
  'CDF': 'cd',
  'HTG': 'ht',
  'ALL': 'al',
  'MKD': 'mk',
  'RSD': 'rs',
  'BAM': 'ba',
  'MDL': 'md',
}

/**
 * Get flag URL for a currency code
 */
export function getFlagUrl(currencyCode: string): string {
  if (!currencyCode) return ''
  
  const countryCode = currencyToCountry[currencyCode.toUpperCase()] || currencyCode.toLowerCase().slice(0, 2)
  
  if (countryCode && countryCodes[countryCode as keyof typeof countryCodes]) {
    return `https://flagcdn.com/w80/${countryCode}.png`
  }
  
  return ''
}

/**
 * Get both flag URLs for a currency pair
 */
export function getCurrencyPairFlags(ticker: string): CurrencyFlags {
  const { base, quote } = parseCurrencyPair(ticker)
  
  return {
    baseFlag: getFlagUrl(base),
    quoteFlag: getFlagUrl(quote),
    baseCurrency: base,
    quoteCurrency: quote
  }
}

/**
 * Format currency pair for display
 */
export function formatCurrencyPair(ticker: string): string {
  const { base, quote } = parseCurrencyPair(ticker)
  return `${base}/${quote}`
}

