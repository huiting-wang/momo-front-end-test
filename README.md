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

AI Agent 決策見 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。

## 文件導覽

- [`docs/SA_MOMO_TEST.md`](./docs/SA_MOMO_TEST.md) — 技術選型、路由、
  元件架構、Mock Data 結構、Rendering 策略。

## 技術棧

Nuxt 4 (SSR) · Vue 3 · Pinia · TypeScript · 原生 CSS（無 UI 套件，
參照 momo 視覺樣式）

## 範疇排除（Scope Cut）

明確排除以下項目，記錄理由條列如下：

- **登入/會員系統**：題目限定純前端 mock，無真實後端，做假登入只會增加
  程式碼量卻不增加任何考核重點。
- **真實金流/結帳流程**：購物車到「結帳按鈕」即止，不模擬付款頁 （考慮測驗時間性限制）。
- **i18n**：依據觀察，momo 目前為台灣單一市場站，尚無需要多語言示範。
- **後端 API**：所有資料皆為 local JSON + composable 模擬延遲，不架設
  mock server（如 MSW），因為專案規模不需要到那個複雜度。
- **SEO**：無提供標準規範需求，只提供 meta title。
- **資安處理**：XSS、CORS 因是前端單純示範，所以無實作。只在 nuxt.config.ts 設定`點擊挾持攻擊`配置。
