/**
 * 提供商品價格相關的格式化工具函式。
 *
 * @returns `formatPrice`、`discountPercent`、`formatSoldCount` 三個工具函式
 */
export function useFormatPrice() {
  /**
   * 格式化價格，使用台灣地區的數字格式
   * @param value - 要格式化的價格數值
   * @returns 格式化後的價格字串
   */
  function formatPrice(value: number): string {
    return value.toLocaleString('zh-TW')
  }

  /**
   * 計算折扣百分比
   * @param price - 折扣後的價格
   * @param originalPrice - 原價
   * @returns 折扣百分比，若原價小於等於折扣後價格則回傳 null
   */
  function discountPercent(price: number, originalPrice?: number | null): number | null {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round((1 - price / originalPrice) * 100)
  }

  /**
   * 格式化已售出數量
   * @param count - 已售出數量
   * @returns 格式化後的已售出數量字串，若數量為 null 或 0 則回傳 null
   */
  function formatSoldCount(count?: number | null): string | null {
    if (!count) return null
    if (count >= 1000) {
      return `已售 ${(count / 1000).toFixed(1)}k+`
    }
    return `已售 ${count}`
  }

  return { formatPrice, discountPercent, formatSoldCount }
}
