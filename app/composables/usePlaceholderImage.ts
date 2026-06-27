/**
 * 純前端生成商品佔位圖（SVG data URI），不依賴任何外部圖片服務或真實圖片，
 * 確保 100% 離線可運行、且不會有版權或外部 API 呼叫的問題。
 * 用 imageSeed 字串 hash 出穩定的顏色，讓同一商品每次看到的色塊一致。
 */
const palette = [
  ['#ffd6e8', '#e3007f'],
  ['#d0ebff', '#1864ab'],
  ['#d3f9d8', '#2b8a3e'],
  ['#fff3bf', '#e8590c'],
  ['#e5dbff', '#5f3dc4'],
  ['#ffe8cc', '#d9480f'],
  ['#c5f6fa', '#0c8599'],
  ['#f8e4ff', '#9c36b5'],
]

/**
 * 將字串 seed 雜湊為穩定的非負整數，用於從色盤中固定挑選顏色。
 *
 * @param seed - 任意字串（通常為商品 ID 或名稱）
 * @returns 對應的 32-bit 無號整數
 */
function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * 提供純前端 SVG 佔位圖生成工具，不依賴任何外部服務。
 *
 * @returns `getImageUrl` 函式，可依 seed 字串產生穩定的 SVG data URI
 */
export function usePlaceholderImage() {
  /**
   * 依 seed 字串生成 SVG 佔位圖的 data URI。
   * 相同的 seed 永遠產生相同的顏色與縮寫文字。
   *
   * @param seed - 用來決定顏色與預設縮寫的字串（通常為商品 ID）
   * @param label - 顯示在圖片上的文字；若省略則取 `seed` 前兩字元
   * @returns `data:image/svg+xml;utf8,...` 格式的 data URI
   */
  function getImageUrl(seed: string, label?: string): string {
    const hash = hashSeed(seed)
    const colorPair = palette[hash % palette.length] ?? palette[0]!
    const [bg, fg] = colorPair
    const initials = (label ?? seed).slice(0, 2).toUpperCase()

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="${bg}" />
        <circle cx="200" cy="170" r="70" fill="${fg}" opacity="0.15" />
        <text x="200" y="195" font-family="sans-serif" font-size="56" font-weight="700"
          fill="${fg}" text-anchor="middle">${initials}</text>
      </svg>
    `.trim()

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  return { getImageUrl }
}
