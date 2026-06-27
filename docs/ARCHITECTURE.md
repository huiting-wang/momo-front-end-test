# 架構規劃文件 — Momo Mocking 專案

> 本文件先於程式碼撰寫完成，記錄技術選型理由、路由設計、狀態管理與
> Rendering 策略的決策過程，作為「開發流程規劃」的第一手證據。

## 1. 技術棧

| 項目 | 選擇 | 理由 |
|---|---|---|
| Framework | **Nuxt 4 (SSR)** | momo 真實站是 SSR + CSR 混合的電商站；Nuxt 內建 `routeRules` 可逐路由宣告渲染策略，剛好用來示範「為什麼某頁 SSR、某頁不」的設計思考，而不是整站用同一招 |
| 狀態管理 | **Pinia** | Nuxt 官方推薦、SSR-safe（避免 client/server state 污染），購物車與篩選條件這類跨頁共享狀態適合用 store 而非 props drilling |
| Mock Data | 靜態 JSON + `useMockApi()` composable | 用 composable 包一層、模擬非同步延遲與分頁，讓資料存取介面長得像未來真正打 API 時的樣子，降低未來替換成本 |
| 樣式 | 原生 CSS (scoped) + CSS variables | 不引入 UI 套件，刻意還原 momo 的視覺語言（桃紅 #E3007F、密集網格、徽章式標籤），用套件反而會抹平這個差異點 |
| 套件管理 | npm | 沿用環境預設 |

## 2. 路由設計

```
/                     首頁：banner + 分類捷徑 + 多組商品 carousel
/search?q=&cat=&sort= 搜尋結果頁：篩選 + 排序 + 商品 grid + 分頁
/goods/[id]           商品詳情頁：圖片、規格選擇、加購、猜你喜歡
/discover             探索頁：圖卡瀑布流（類 IG Discover）
/live                 直播頁：直播列表 + 模擬「直播中」商品輪播
/cart                 購物車：閉環體驗（momo 核心轉換路徑，額外加入）
```

選擇加入 `/cart` 是因為題目只要求「至少一個」路由，但 momo 的核心商業邏輯
是「瀏覽 → 加入購物車 → 結帳」，少了購物車這個從首頁到商品頁的資料流就斷在
半路，無法展示 Pinia 跨頁狀態管理的價值。

## 3. Rendering 策略（逐路由說明，對應 nuxt.config.ts 的 routeRules）

| 路由 | 策略 | 理由 |
|---|---|---|
| `/` | **SSR** (`ssr: true`, 預設) | 電商首頁是 SEO 與首屏速度的關鍵頁，真實 momo 首頁也是伺服器端輸出完整 HTML 後再水合 |
| `/goods/[id]` | **SSR** | 商品頁需要被搜尋引擎索引（標題、價格、圖片），且使用者常透過外部連結直接進入，SSR 可避免「先看到空白再閃出內容」 |
| `/search` | **SSR (初次) + CSR (互動)** | 首次進入（含 query string）需要 SEO 與可分享連結，但篩選器互動（換排序、勾選分類）若每次都整頁重新請求會很慢，故初次資料用 `useAsyncData` SSR 注入，互動後改為 client 端重新抓取 + 局部更新 |
| `/discover` | **CSR-heavy**（`ssr: false` via routeRules） | 本質是個人化、低 SEO 價值的瀏覽型內容（類似社群 feed），SSR 對這種「無限滾動 + 隨機探索」頁面投資回報低，改用骨架畫面 + client 端動態載入更划算 |
| `/live` | **CSR-heavy** | 直播列表本身是高即時性資料（誰在線、庫存倒數），SSR 渲染出的內容幾乎立刻過期，不如直接交給 client 端輪詢更新 |
| `/cart` | **CSR only**（`ssr: false`） | 購物車是高度個人化、不該被快取或索引的頁面，真實 momo 購物車也不做 SSR |

對應設定（節錄）：

```ts
routeRules: {
  '/': { ssr: true },
  '/goods/**': { ssr: true },
  '/search': { ssr: true },
  '/discover': { ssr: false },
  '/live': { ssr: false },
  '/cart': { ssr: false },
}
```

這個表格本身就是「實作結果與真實網站差異」分析的素材之一：真實 momo 用的是
更精細的 edge cache + CDN 分層策略，本專案用 Nuxt `routeRules` 做了簡化版的
等價示範。

## 4. Component Architecture

```
app/
├─ components/
│  ├─ layout/        Header, Footer, CategoryNav, SearchBar
│  ├─ product/        ProductCard, ProductGrid, ProductCarousel,
│  │                   ProductBadge, RatingStars, PriceTag
│  └─ common/          SkeletonCard, EmptyState, Breadcrumb
├─ composables/
│  ├─ useMockApi.ts     模擬非同步資料存取（products, search, discover, live）
│  └─ useFormatPrice.ts 價格/折扣格式化
├─ stores/
│  ├─ cart.ts           購物車 store（加入、移除、數量、總計）
│  └─ filters.ts        搜尋頁篩選/排序狀態
├─ data/
│  ├─ products.json
│  ├─ banners.json
│  ├─ categories.json
│  └─ liveStreams.json
└─ pages/
   ├─ index.vue
   ├─ search/index.vue
   ├─ goods/[id].vue
   ├─ discover/index.vue
   ├─ live/index.vue
   └─ cart/index.vue
```

設計原則：
- **Container/Presentational 拆分**：`pages/*` 負責資料抓取與路由參數，
  `components/product/*` 純粹接收 props 渲染，不直接呼叫 composable，方便
  之後寫單元測試或替換資料來源。
- **ProductCard 是全站最高複用元件**，首頁 carousel、搜尋 grid、商品頁的
  「猜你喜歡」都共用同一顆元件 — 故意設計成這樣以對應「考核重點：開發效率」，
  Agent 在這顆元件上多花的打磨時間會在三個頁面同時回收。

## 5. Mock Data 結構設計

```ts
interface Product {
  id: string
  title: string
  brand?: string
  price: number
  originalPrice?: number      // 用於計算折扣 %，null 代表無折扣
  discountTag?: string        // 例如 "限時優惠"
  badges: string[]            // 例如 ["24h到貨", "滿千折百", "新品"]
  imageUrl: string
  rating: number               // 0~5
  reviewCount: number
  soldCount?: number
  category: string
  tags: string[]               // 用於 discover/search 篩選
}
```

刻意保留 momo 商品卡上常見的「徽章 (badges)」、「劃線原價」、「已售數量」
欄位，這些是 momo 視覺密度與信任感設計的核心差異點，純粹放 title/price 兩
個欄位無法還原體驗。

## 6. 不做（Scope Cut）與理由

明確排除以下項目，理由記錄下來避免之後被誤認為遺漏：

- **登入/會員系統**：題目限定純前端 mock，無真實後端，做假登入只會增加
  程式碼量卻不增加任何考核重點的訊號。
- **真實金流/結帳流程**：購物車到「結帳按鈕」即止，不模擬付款頁。
- **i18n**：momo 是台灣單一市場站，不需要多語言示範。
- **後端 API**：所有資料皆為 local JSON + composable 模擬延遲，不架設
  mock server（如 MSW），因為專案規模不需要到那個複雜度，過度設計反而
  扣分。
