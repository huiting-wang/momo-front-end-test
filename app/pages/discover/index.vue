<script setup lang="ts">
import type { Product } from '~/composables/useMockApi'

// 本頁在 nuxt.config.ts 設為 ssr:false，所以這裡的資料抓取
// 一律發生在 client 端；不用 useAsyncData 的 SSR 注入機制，
// 改用 onMounted + ref 手動管理，更貼近「個人化 feed」的真實情境。
const api = useMockApi()
const cartStore = useCartStore()
const toast = useToast()

const items = ref<Product[]>([])
const page = ref(1)
const isLoading = ref(false)
const isInitialLoading = ref(true)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

async function loadMore() {
  if (isLoading.value) return
  isLoading.value = true
  const next = await api.getDiscoverFeed(page.value, 12)
  items.value.push(...next)
  page.value++
  isLoading.value = false
  isInitialLoading.value = false
}

function handleAddToCart(product: Product) {
  cartStore.addItem(product)
  toast.show(`已加入購物車：${product.title}`)
}

onMounted(async () => {
  await loadMore()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMore()
    },
    { rootMargin: '200px' },
  )
  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="page-container discover-page">
    <h1 class="section-title"><span class="accent-bar" />探索好物</h1>
    <p class="hint">為你隨機探索的商品，往下滑載入更多</p>

    <SkeletonGrid v-if="isInitialLoading" :count="12" />

    <template v-else>
      <div class="discover-grid">
        <div v-for="(product, i) in items" :key="`${product.id}-${i}`" class="discover-item">
          <ProductCard :product="product" @add-to-cart="handleAddToCart" />
        </div>
      </div>

      <div ref="sentinel" class="sentinel" aria-hidden="true" />

      <p v-if="isLoading" class="loading-more">載入更多中...</p>
    </template>
  </div>
</template>

<style scoped>
.discover-page {
  padding-top: 16px;
  padding-bottom: 32px;
}
.hint {
  font-size: 13px;
  color: var(--momo-text-light);
  margin: 0 0 16px;
}

.discover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 600px) {
  .discover-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 900px) {
  .discover-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.sentinel {
  height: 1px;
}
.loading-more {
  text-align: center;
  font-size: 13px;
  color: var(--momo-text-light);
  padding: 16px 0;
}
</style>
