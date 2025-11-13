/**
 * Format a price with appropriate decimal places
 */
export function formatPrice(price: number | null | undefined, decimals: number = 6): string {
  if (price === null || price === undefined) return '0.000000'
  return price.toFixed(decimals)
}