export function useFormatPrice() {
  function formatPrice(value: number): string {
    return value.toLocaleString('zh-TW')
  }

  function discountPercent(price: number, originalPrice?: number | null): number | null {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round((1 - price / originalPrice) * 100)
  }

  function formatSoldCount(count?: number | null): string | null {
    if (!count) return null
    if (count >= 1000) {
      return `已售 ${(count / 1000).toFixed(1)}k+`
    }
    return `已售 ${count}`
  }

  return { formatPrice, discountPercent, formatSoldCount }
}
