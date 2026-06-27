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

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

export function usePlaceholderImage() {
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
