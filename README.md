# Momo Mocking — 純前端 momo 電商網站練習

> 前端測驗題目 A：Mocking momoshop。
> 純前端實作，無任何真實網站 API 呼叫，所有資料皆為 Mock Data。

## 快速開始

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build     # 產出 SSR 版本
node .output/server/index.mjs   # 啟動 production server
```

## 路由總覽

| 路由 | 說明 | Rendering 策略 |
|---|---|---|
| `/` | 首頁：banner + 分類商品 carousel | SSR |
| `/search` | 搜尋結果頁：篩選 + 排序 + 分頁 | SSR (初次) + CSR (互動) |
| `/goods/[id]` | 商品詳情頁 | SSR |
| `/discover` | 探索頁：無限滾動瀑布流 | CSR only |
| `/live` | 直播頁：直播列表 + 模擬直播商品 | CSR only |
| `/cart` | 購物車 | CSR only |

完整決策理由見 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。

## 文件導覽

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — 技術選型、路由、
  元件架構、Mock Data 結構、Rendering 策略的決策過程
- [`docs/AGENT_COLLABORATION_ANALYSIS.md`](./docs/AGENT_COLLABORATION_ANALYSIS.md) —
  開發流程規劃與 Agent 協作效率評估、與真實 momo 網站的差異分析
- [`docs/BONUS_ITERATION_AND_VALIDATION.md`](./docs/BONUS_ITERATION_AND_VALIDATION.md) —
  Human-Agent Iteration Architecture、Validation / Observability 思路

## 技術棧

Nuxt 4 (SSR) · Vue 3 · Pinia · TypeScript · 原生 CSS（無 UI 套件，
刻意還原 momo 視覺語言）

## 範疇排除（Scope Cut）

不包含：登入/會員系統、真實金流結帳、i18n、真實後端 API。
完整理由見架構文件第 6 節。
