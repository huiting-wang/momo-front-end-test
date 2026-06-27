<script setup lang="ts">
import type { Product } from '~/types/product'

const route = useRoute()
const router = useRouter()
const api = useMockApi()
const filtersStore = useFiltersStore()
const cartStore = useCartStore()
const toast = useToast()

const pageSize = 20

// 用 query string 作為唯一資料來源，讓搜尋結果可被分享/重整後還原
const query = computed(() => ({
  q: (route.query.q as string) || '',
  category: (route.query.category as string) || '',
  sort: (route.query.sort as string) || 'default',
  page: Number(route.query.page) || 1,
}))

// 進頁時把 URL 上的篩選條件同步進 store，讓篩選器 UI 與網址一致
watchEffect(() => {
  filtersStore.setCategory(query.value.category)
  filtersStore.setSort(query.value.sort as any)
})

const { data: categories } = await useAsyncData('search-categories', () => api.getCategories())

/**
 * 初次資料用 useAsyncData，SSR 時會在伺服器端先抓好；之後 query 變動時
 * （換頁、換排序）會在 client 端重新抓取並局部更新，不整頁刷新。
 */
const { data: result, status } = await useAsyncData(
  () => api.search({
    q: query.value.q,
    category: query.value.category,
    sort: query.value.sort as any,
    page: query.value.page,
    pageSize,
  }),
  { watch: [query] },
)

const isLoading = computed(() => status.value === 'pending')
const totalPages = computed(() =>
  result.value ? Math.max(1, Math.ceil(result.value.total / pageSize)) : 1,
)

function updateQuery(patch: Record<string, string | number | undefined>) {
  router.push({
    path: '/search',
    query: { ...route.query, ...patch, page: patch.page ?? 1 },
  })
}

function handleAddToCart(product: Product) {
  cartStore.addItem(product)
  toast.show(`已加入購物車：${product.title}`)
}

useHead(() => ({
  title: query.value.q
    ? `「${query.value.q}」搜尋結果 - momo購物網`
    : '商品搜尋 - momo購物網',
}))
</script>

<template>
  <div class="page-container search-page">
    <CommonBreadcrumb
      :items="[
        { label: '首頁', to: '/' },
        { label: query.q ? `搜尋：${query.q}` : '搜尋結果' },
      ]"
    />

    <div class="search-layout">
      <!-- 篩選側欄 -->
      <aside class="filters" aria-label="篩選條件">
        <h2 class="filters-title">分類</h2>
        <ul class="category-filter-list">
          <li>
            <button
              class="filter-pill"
              :class="{ active: !query.category }"
              @click="updateQuery({ category: undefined })"
            >
              全部
            </button>
          </li>
          <li v-for="cat in categories" :key="cat.id">
            <button
              class="filter-pill"
              :class="{ active: query.category === cat.id }"
              @click="updateQuery({ category: cat.id })"
            >
              {{ cat.icon }} {{ cat.name }}
            </button>
          </li>
        </ul>
      </aside>

      <!-- 結果區 -->
      <div class="results">
        <div class="results-toolbar">
          <p class="result-count">
            <template v-if="!isLoading && result">共 {{ result.total }} 件商品</template>
          </p>

          <div class="sort-buttons" role="group" aria-label="排序方式">
            <button
              v-for="opt in [
                { value: 'default', label: '預設' },
                { value: 'sold-desc', label: '熱銷' },
                { value: 'price-asc', label: '價格低到高' },
                { value: 'price-desc', label: '價格高到低' },
                { value: 'rating-desc', label: '評分' },
              ]"
              :key="opt.value"
              class="sort-btn"
              :class="{ active: query.sort === opt.value }"
              @click="updateQuery({ sort: opt.value })"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <CommonSkeletonGrid v-if="isLoading" :count="10" />

        <CommonEmptyState v-else-if="!result?.items.length" />

        <template v-else>
          <ProductGrid :products="result.items" @add-to-cart="handleAddToCart" />

          <nav class="pagination" aria-label="分頁">
            <button
              :disabled="query.page <= 1"
              @click="updateQuery({ page: query.page - 1 })"
            >
              上一頁
            </button>
            <span class="page-indicator">{{ query.page }} / {{ totalPages }}</span>
            <button
              :disabled="query.page >= totalPages"
              @click="updateQuery({ page: query.page + 1 })"
            >
              下一頁
            </button>
          </nav>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding-top: 12px;
  padding-bottom: 32px;
}

.search-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.filters {
  flex: 0 0 160px;
  display: none;
}
@media (min-width: 768px) {
  .filters {
    display: block;
  }
}
.filters-title {
  font-size: 14px;
  margin: 8px 0;
}
.category-filter-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-pill {
  text-align: left;
  background: var(--momo-white);
  border: 1px solid var(--momo-border);
  border-radius: var(--momo-radius-sm);
  padding: 8px 10px;
  font-size: 13px;
  width: 100%;
}
.filter-pill.active {
  border-color: var(--momo-pink);
  color: var(--momo-pink);
  background: var(--momo-pink-bg);
}

.results {
  flex: 1;
  min-width: 0;
}

.results-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.result-count {
  font-size: 13px;
  color: var(--momo-text-light);
  margin: 0;
}
.sort-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.sort-btn {
  background: var(--momo-white);
  border: 1px solid var(--momo-border);
  border-radius: 14px;
  padding: 5px 12px;
  font-size: 12px;
}
.sort-btn.active {
  background: var(--momo-pink);
  border-color: var(--momo-pink);
  color: var(--momo-white);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}
.pagination button {
  background: var(--momo-white);
  border: 1px solid var(--momo-border);
  border-radius: var(--momo-radius-sm);
  padding: 8px 16px;
  font-size: 13px;
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-indicator {
  font-size: 13px;
  color: var(--momo-text-light);
}
</style>
