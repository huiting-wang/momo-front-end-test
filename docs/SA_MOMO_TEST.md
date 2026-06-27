---
title: SA 文件 - momo 購物網前端練習專案
---

# SA 文件 - momo 購物網前端練習專案

> - 文件日期：2026-06-27
> - 規劃者：Claude (AI Agent) & Grace Wang
> - 需求來源者：前端測驗題目 A — Mocking momoshop
> - 需求文件：前端測驗題目（純文字題目，無正式 PRD）

[TOC]

## 說明

本專案為前端技術測驗題目「A. Mocking momoshop」之實作：參考並建立
momo 電商網站的純前端版本，不呼叫任何真實後端 API，所有商品與活動資料
皆為自行設計之 Mock Data。

開發目的有三層：

1. 還原 momo 購物網站核心使用者場景（首頁瀏覽、搜尋、商品詳情、購物車）的介面與互動邏輯。
2. 透過 Rendering 策略（SSR/CSR）的逐頁設計，示範對電商網站「哪些頁面
   該被搜尋引擎索引、哪些頁面該優先互動速度」的判斷依據。
3. 作為 Human-Agent 協作流程的示範案例，記錄規劃、實作、自我驗證、
   差異分析的完整過程（詳見 `docs/AGENT_COLLABORATION_ANALYSIS.md`）。

本文件不含真實商業需求或真實使用者調研，案例項目皆基於對 momo
真實網站介面行為的觀察與合理推測。

---

## 需求
### 需求收集與分析

依題目要求條列功能需求：

| 需求項目 | 說明 |
|---|---|
| 首頁瀏覽 | 呈現促銷活動 Banner、商品分類捷徑、各分類熱銷商品橫向捲動清單 |
| 商品搜尋 | 支援關鍵字搜尋、分類篩選、多種排序方式、分頁，搜尋條件須可透過網址分享/重整還原 |
| 商品詳情 | 呈現單一商品完整資訊（價格、折扣、評分、徽章），支援數量調整與加入購物車，並提供同分類「猜你喜歡」推薦 |
| 購物車 | 可加入商品 |
| 全站導覽 | 頂部固定 Header（搜尋列、購物車圖示與數量徽章）、分類導覽列、Footer |
| 渲染策略差異化 | 依各頁面 SEO 重要性與即時性需求，分別採用 SSR 或 CSR-only 策略 |

---

## 技術棧

| 項目 | 選擇 | 理由 |
|---|---|---|
| Framework | **Nuxt 4 (SSR)** | momo 真實站是 SSR + CSR 混合的電商站；Nuxt 內建 `routeRules` 可逐路由宣告渲染策略，剛好用來示範「為什麼某頁 SSR、某頁不」的設計思考，而不是整站用同一招 |
| 狀態管理 | **Pinia** | Nuxt 官方推薦、SSR-safe（避免 client/server state 污染），購物車與篩選條件這類跨頁共享狀態適合用 store 而非 props drilling |
| Mock Data | 靜態 JSON + `useMockApi()` composable | 用 composable 包一層、模擬非同步延遲與分頁，讓資料存取介面長得像未來真正打 API 時的樣子，降低未來替換成本 |
| 樣式 | 原生 CSS (scoped) + CSS variables | 不引入 UI 套件，刻意還原 momo 的視覺語言（桃紅 #E3007F、密集網格、徽章式標籤），用套件反而會抹平這個差異點 |
| 套件管理 | npm | 沿用環境預設 |

---

## 設計原則

Container/Presentational 拆分：pages/* 負責資料抓取與路由參數， components/product/* 純粹接收 props 渲染，不直接呼叫 composable，方便 之後寫單元測試或替換資料來源。

ProductCard 是全站最高複用元件，首頁 carousel、搜尋 grid、商品頁的「猜你喜歡」都共用同一元件。

## 案例
### 案例收集與分析

依功能需求條列使用者操作案例情境：

**首頁瀏覽**
- 案例 1：使用者開啟首頁，4 組促銷 Banner 每 4 秒自動輪播，可手動點擊
  下方圓點指示器切換。
- 案例 2：使用者點擊 Banner，導向對應分類的搜尋結果頁。
- 案例 3：使用者在某分類的橫向商品清單按右側箭頭，清單向右平滑捲動。
- 案例 4：使用者點擊商品清單的「加入購物車」按鈕，不導頁、直接加入購物車
  並彈出 Toast 提示。

**商品搜尋**
- 案例 1：使用者在 Header 搜尋框輸入關鍵字並送出，導向 `/search?q=關鍵字`。
- 案例 2：使用者在搜尋結果頁切換排序（預設/熱銷/價格高低/評分），網址
  query string 同步更新，結果局部更新（不整頁刷新）。
- 案例 3：使用者點擊分類篩選列的某分類，結果即時篩選並回到第 1 頁。
- 案例 4：搜尋關鍵字無符合結果，呈現空狀態提示文案。
- 案例 5：使用者直接以分享連結（含完整 query string）進入搜尋頁，重整
  後篩選條件與結果應與分享時一致。
- 案例 6：使用者點擊分頁按鈕「上一頁/下一頁」，按鈕在邊界（第一頁/最後
  一頁）應呈現 disabled 狀態。

**商品詳情**
- 案例 1：使用者進入存在的商品 ID，頁面正確顯示商品資訊，且該回應狀態
  碼為 200，`<title>` 含商品名稱。
- 案例 2：使用者輸入不存在的商品 ID，伺服器應回應 404 並顯示對應錯誤頁。
- 案例 3：使用者調整購買數量（最小值為 1，無上限），按下「加入購物車」
  時依當前數量加入。
- 案例 4：使用者瀏覽「猜你喜歡」並點擊其中一項加入購物車，不離開當前
  商品頁。

**全站導覽**
- 案例 1：購物車內有商品時，Header 購物車圖示右上角顯示數量徽章；無
  商品時不顯示徽章。

---

## 功能流程分析
### 流程分析

依使用者操作路徑繪製主要流程：

**流程一：瀏覽 → 加入購物車 → 查看購物車**

```
首頁 / 搜尋結果頁 / 商品詳情頁
        │  (點擊「加入購物車」)
        ▼
  cartStore.addItem()
        │
        ▼
  Toast 提示「已加入購物車：XXX」
        │
        ▼
  使用者點擊 Header 購物車圖示
```

**流程二：搜尋結果頁的篩選/排序互動（SSR 初次載入 + CSR 互動更新）**

```
使用者進入 /search（首次，含或不含 query string）
        │
        ▼
  伺服器端執行 useAsyncData，依 query 組裝 search()
        │
        ▼
  回傳含完整商品清單的 HTML（SSR）
        │
        ▼
  使用者點擊排序/分類篩選按鈕
        │
        ▼
  router.push 更新 query string
        │
        ▼
  useAsyncData 的 watch([query]) 觸發，於 client 端重新執行 search()
        │
        ▼
  僅結果區域局部更新（Skeleton → 新結果），不整頁重新請求
```

**流程三：商品詳情頁的 404 處理**

```
使用者進入 /goods/[id]
        │
        ▼
  伺服器端執行 getProductById(id)
        │
        ├─ 找到商品 → 正常渲染，回應 200
        └─ 查無商品 → throw createError({ statusCode: 404 })
                          │
                          ▼
                  Nuxt 內建錯誤頁，回應 404
```

---

## 功能劃分
### 功能項目

#### 連結位置

| 功能 | 路徑 |
|---|---|
| 首頁 | `/` |
| 商品搜尋 | `/search` |
| 商品詳情 | `/goods/[id]` |

#### 功能說明

- **首頁**：促銷 Banner 輪播 + 各分類熱銷商品橫向捲動清單，是全站的
  入口頁與 SEO 重點頁面。
- **商品搜尋**：依關鍵字/分類/排序條件查詢商品，結果以網格呈現並支援
  分頁，是轉換路徑的核心節點。
- **商品詳情**：單一商品的完整資訊頁，含加購與關聯商品推薦，需被搜尋
  引擎索引以承接外部連結流量。
- **購物車**：僅顯示數量效果

#### 功能設計規格

**首頁**

| 規則內容 |
| ---|
| Banner 自動輪播間隔固定 4000ms，頁面卸載時須清除 timer |
| 每個分類僅展示該分類前 10 項商品於橫向清單 |
| 橫向清單左右箭頭僅在桌面寬度（≥768px）顯示 |
| 點擊商品卡片的「加入購物車」按鈕須阻止導頁事件（`preventDefault` + `stopPropagation`） |

**商品搜尋**

| 規則內容 |
| ---|
| query string 為唯一資料來源（`q`, `category`, `sort`, `page`），UI 狀態與網址須保持同步 |
| 切換排序或分類時，頁碼強制重設為第 1 頁 |
| 每頁顯示 20 筆商品，分頁邊界（第一頁/最後一頁）對應按鈕須 disabled |
| 排序選項：`default` / `price-asc` / `price-desc` / `rating-desc` / `sold-desc` |
| 關鍵字比對範圍涵蓋商品標題、品牌、tags（不區分大小寫） |

**商品詳情**

| 規則內容 |
| ---|
| 商品 ID 不存在時，伺服器端回應 HTTP 404，並交由 Nuxt 內建錯誤頁處理 |
| 購買數量最小值為 1，無上限值限制；數量為 1 時「減少」按鈕 disabled |
| 折扣百分比僅在 `originalPrice` 存在且大於 `price` 時計算並顯示 |
| 「猜你喜歡」固定取同分類前 8 項（排除自己） |

---

## 頁面

- 本專案無外部 UI/UX 精稿，視覺設計依「還原 momo 真實網站視覺語言」
  為原則自行設計（桃紅色 `#E3007F` 主色、密集網格、徽章式標籤）。
- 各頁面實際畫面請參考已部署之 Nuxt 專案（`npm run dev` 後於
  `http://localhost:3000` 檢視），頁面清單詳見〈功能劃分〉之〈連結位置〉。
- 設計細節（配色變數、版面斷點）統一定義於 `app/assets/css/main.css`。

---

## 欄位
### 欄位統整

本專案無真實資料庫，以下以 Mock Data（JSON 檔案）模擬資料表結構，
存放於 `app/data/`：

**Product（商品）— `products.json`，共 140 筆**

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | string | 商品唯一識別碼，格式 `M00001`～`M00140` |
| title | string | 商品標題 |
| brand | string \| undefined | 品牌名稱 |
| price | number | 售價 |
| originalPrice | number \| null | 原價，無折扣時為 null |
| discountTag | string \| null | 折扣標籤文字（如「限時優惠」） |
| badges | string[] | 商品徽章清單（如「24h到貨」「滿千折百」） |
| imageSeed | string | 用於產生佔位圖的種子字串 |
| rating | number | 評分，範圍 0～5 |
| reviewCount | number | 評論數 |
| soldCount | number \| null | 已售數量 |
| category | string | 所屬分類 ID |
| tags | string[] | 搜尋比對用標籤 |

**Category（分類）— `categories.json`，共 10 筆**

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | string | 分類唯一識別碼 |
| name | string | 分類顯示名稱 |
| icon | string | 分類圖示（emoji） |

**Banner（首頁促銷活動）— `banners.json`，共 4 筆**

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | string | 唯一識別碼 |
| title | string | 活動標題 |
| subtitle | string | 活動副標 |
| colorFrom / colorTo | string | 漸層背景起訖色 |
| linkCategory | string | 點擊後導向的分類 ID |

---

## 資料格式分析與定義
### 流程控制參數、資料交換格式

本專案無真實後端 Endpoint，以下以 `useMockApi()` composable 內的函式
簽名模擬未來若替換為真實 API 時的介面格式：

**getCategories()**
- 回應格式：`Category[]`
- 異動註記：無，全量回傳

**getBanners()**
- 回應格式：`Banner[]`
- 異動註記：無，全量回傳

**getProductById(id: string)**
- 請求參數：`id`（path 參數）
- 回應格式：`Product | null`
- 回應代碼對應：找到 → 200（頁面正常渲染）；查無 → 404（`createError`
  觸發 Nuxt 錯誤頁）

**getRelatedProducts(product, limit = 8)**
- 請求參數：`product`（當前商品物件）、`limit`（筆數上限）
- 回應格式：`Product[]`
- 規則：同分類、排除自己，取前 `limit` 筆

**search(params: SearchParams)**

| 參數 | 型別 | 必填 | 說明 |
|---|---|---|---|
| q | string | 否 | 關鍵字 |
| category | string | 否 | 分類 ID |
| sort | enum | 否 | `default` / `price-asc` / `price-desc` / `rating-desc` / `sold-desc` |
| page | number | 否，預設 1 | 頁碼 |
| pageSize | number | 否，預設 20 | 每頁筆數 |

- 回應格式：`{ items: Product[], total: number, page: number, pageSize: number }`
- 異動註記：query string ↔ 此參數物件為雙向同步（網址即狀態）

**getProductsByIds(ids: string[])**
- 回應格式：`Product[]`（依輸入順序，過濾不存在的 ID）

> 備註：所有函式皆內建 50～250ms 不等的模擬延遲（`delay()`），目的是讓
> Loading/Skeleton 狀態在開發與展示階段「真的會被看到」，並非模擬真實
> 網路狀況。

---

## 函式庫設計
### 影響檔案結構

```
momo-clone/
├─ app/
│  ├─ app.vue                    全域 Layout 組裝（Header/CategoryNav/Footer/Toast）
│  ├─ assets/css/main.css        全域樣式、CSS variables（色彩/間距/字體）
│  ├─ components/
│  │  ├─ layout/                 AppHeader, AppFooter, CategoryNav
│  │  ├─ product/                ProductCard, ProductGrid, ProductCarousel, RatingStars
│  │  └─ common/                 SkeletonGrid, EmptyState, Breadcrumb, AppToast
│  ├─ composables/
│  │  ├─ useMockApi.ts           Mock 資料存取層（全部資料存取的唯一入口）
│  │  ├─ useFormatPrice.ts       價格/折扣/已售數量格式化
│  │  ├─ usePlaceholderImage.ts  SVG 佔位圖生成（無外部圖片依賴）
│  │  └─ useToast.ts             輕量全域 Toast 通知狀態
│  ├─ stores/
│  │  ├─ cart.ts                 購物車 Pinia store
│  │  └─ filters.ts              搜尋篩選狀態 Pinia store
│  ├─ data/                      products.json, categories.json, banners.json, liveStreams.json
│  └─ pages/
│     ├─ index.vue               首頁
│     ├─ search/index.vue        搜尋結果頁
│     ├─ goods/[id].vue          商品詳情頁
├─ docs/                         本次 SA 文件、架構規劃文件、協作分析文件
├─ eslint.config.mjs             程式品質檢測設定
├─ nuxt.config.ts                routeRules（SSR/CSR 策略）、modules、head 設定
└─ public/                       靜態資源（favicon, robots.txt）
```

**關鍵設計決策**：`useMockApi.ts` 是唯一允許讀取 `app/data/*.json` 的
模組，所有頁面與元件皆透過此 composable 取得資料，不直接 import JSON
檔案，目的是讓未來若要替換為真實後端 API，只需改動這一個檔案內部實作，
對外函式簽名不變。

---

**問題與討論**：

---

- **Q1：為何不導入真實的 Mock Server（如 MSW）模擬 API 層？**
  A：題目要求「純前端實作、無任何真實網站 API 呼叫」，且專案規模
  （單一 Mock Data 來源、無多人協作前後端分工）不足以攤平導入 Mock
  Server 的設定成本，故以 composable 直接封裝 JSON 資料存取，已能達到
  「資料存取介面與未來真實 API 形狀相似」的目的。

- **Q2：商品圖片為何不使用真實圖片或外部圖庫 API？**
  A：避免任何版權風險，且維持專案 100% 離線可執行、不依賴外部網路服務，
  改用前端動態生成 SVG 色塊作為佔位圖。

- **Q3：未涵蓋自動化測試（單元測試/E2E）是否為遺漏？**
  A：目前驗證方式為 build/typecheck + 對運行中 server 以 curl 進行
  路由級與內容級的人工驗證腳本，尚未建立持久化的自動化測試套件（如
  Vitest/Playwright）。若此專案要進入下一階段迭代或交接給其他開發者
  維護，建議補上自動化測試作為後續工作項目，目前因應測驗時程未納入。

---

## 參考資料

- 前端測驗題目原文：「A. Mocking momoshop」（使用者提供，無外部連結）
- Nuxt 4 官方發布文件：[https://nuxt.com/blog/v4](https://nuxt.com/blog/v4)
- 專案內部文件：
  - `docs/ARCHITECTURE.md` — 技術選型、路由、Rendering 策略決策過程
  - `docs/AGENT_COLLABORATION_ANALYSIS.md` — 開發流程規劃、Agent 協作

---

<style type="text/css" scoped>
  h1 { counter-reset: h2counter; }
  h2 { counter-reset: h3counter; }
  h3 { counter-reset: h4counter; }
  h4 { counter-reset: h5counter; }
  h5 { counter-reset: h6counter; }
  h2:before {
    counter-increment: h2counter;
    content: counter(h2counter, trad-chinese-informal) ".\0000a0\0000a0";
  }
  h3:before {
    counter-increment: h3counter;
    content: counter(h2counter) "."
              counter(h3counter) ".\0000a0\0000a0";
  }
  h4:before {
    counter-increment: h4counter;
    content: counter(h2counter) "."
              counter(h3counter) "."
              counter(h4counter) ".\0000a0\0000a0";
  }
  h5:before {
    counter-increment: h5counter;
    content: counter(h2counter) "."
              counter(h3counter) "."
              counter(h4counter) "."
              counter(h5counter) ".\0000a0\0000a0";
  }
  h6:before {
    counter-increment: h6counter;
    content: counter(h2counter) "."
              counter(h3counter) "."
              counter(h4counter) "."
              counter(h5counter) "."
              counter(h6counter) ".\0000a0\0000a0";
  }
  .red {
      color: #ff0000;
  }
  .blue {
      color: #0000E3;
  }
</style>
