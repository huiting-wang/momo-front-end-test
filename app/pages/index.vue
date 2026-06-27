<script setup lang="ts">
import type { Product } from '~/types/product'

const api = useMockApi()

const { data: banners } = await useAsyncData('home-banners', () => api.getBanners())

// 首頁瘦身改版:取代原本的分類熱銷 carousel 群組(詳見
// docs/phase1-design-notes.md)。5 個區塊各自呼叫獨立的查詢函式,
// 對應到 5 種不同的業務查詢條件,而非共用同一份「熱銷清單」拆出來貼標籤。
const { data: flashSale } = await useAsyncData('home-flash-sale', () => api.getFlashSale())
const { data: todayPromotions } = await useAsyncData('home-today-promotions', () =>
  api.getTodayPromotions(10),
)
const { data: discountedProducts } = await useAsyncData('home-discounted', () =>
  api.getDiscountedProducts(10),
)
const { data: memberExclusive } = await useAsyncData('home-member-exclusive', () =>
  api.getMemberExclusive(10),
)
const { data: recommended } = await useAsyncData('home-recommended', () =>
  api.getRecommended(10),
)

const cartStore = useCartStore()
const toast = useToast()

function handleAddToCart(product: Product) {
  cartStore.addItem(product)
  toast.show(`已加入購物車：${product.title}`)
}

const heroSlide = ref(0)
let heroTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  heroTimer = setInterval(() => {
    if (!banners.value?.length) return
    heroSlide.value = (heroSlide.value + 1) % banners.value.length
  }, 4000)
})
onUnmounted(() => {
  if (heroTimer) clearInterval(heroTimer)
})
</script>

<template>
  <div class="page-container home-page">
    <!-- Hero Banner -->
    <section v-if="banners?.length" class="hero" aria-label="促銷活動">
      <NuxtLink
        v-for="(banner, i) in banners"
        :key="banner.id"
        :to="{ path: '/search', query: { category: banner.linkCategory } }"
        class="hero-slide"
        :class="{ active: i === heroSlide }"
        :style="{
          background: `linear-gradient(120deg, ${banner.colorFrom}, ${banner.colorTo})`,
        }"
      >
        <h2>{{ banner.title }}</h2>
        <p>{{ banner.subtitle }}</p>
      </NuxtLink>

      <div class="hero-dots" role="tablist" aria-label="切換活動">
        <button
          v-for="(banner, i) in banners"
          :key="banner.id"
          class="dot"
          :class="{ active: i === heroSlide }"
          :aria-label="`查看 ${banner.title}`"
          role="tab"
          :aria-selected="i === heroSlide"
          @click="heroSlide = i"
        />
      </div>
    </section>

    <!-- 首頁瘦身改版:5 個區塊取代原本的分類熱銷 carousel 群組
         順序依設計筆記第3節:急迫性高的放最上面,個人化/長尾內容放最後

         已知限制:「今日促銷」「降價優惠」「為你推薦」的 view-more-link
         皆指向搜尋頁的排序/分類參數,但搜尋頁目前沒有對應「促銷中」
         「降價」「推薦」的篩選條件,點進去後只是排序相近、並非完全
         一致的篩選結果。這個落差屬於時間盒下刻意不做的範圍(搜尋頁
         篩選邏輯擴充需求另計),記錄於 docs/phase1-design-notes.md。

         第二輪瘦身異動:「為你推薦」原本連到 /discover,該路線已隨
         第二輪瘦身(只保留首頁/搜尋/商品詳細頁)被完全移除,故改連
         向 /search,詳見 docs/phase1-design-notes-round2.md -->

    <ProductFlashSaleSection
      v-if="flashSale"
      :sale="flashSale.sale"
      :products="flashSale.products"
      :ends-at="flashSale.endsAt"
      @add-to-cart="handleAddToCart"
    />

    <ProductCarousel
      v-if="todayPromotions?.length"
      title="🔥 今日促銷"
      :products="todayPromotions"
      view-more-link="/search?sort=default"
      @add-to-cart="handleAddToCart"
    />

    <ProductCarousel
      v-if="discountedProducts?.length"
      title="💰 降價優惠"
      :products="discountedProducts"
      view-more-link="/search?sort=price-asc"
      @add-to-cart="handleAddToCart"
    />

    <ProductMemberExclusiveSection
      v-if="memberExclusive?.length"
      :products="memberExclusive"
      @add-to-cart="handleAddToCart"
    />

    <ProductCarousel
      v-if="recommended?.length"
      title="✨ 為你推薦"
      :products="recommended"
      view-more-link="/search"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<style scoped>
.home-page {
  padding-top: 16px;
  padding-bottom: 32px;
}

.hero {
  position: relative;
  border-radius: var(--momo-radius-md);
  overflow: hidden;
  height: 160px;
}
@media (min-width: 768px) {
  .hero {
    height: 240px;
  }
}

.hero-slide {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  justify-content: center;
  padding: 24px 32px;
  color: var(--momo-white);
}
.hero-slide.active {
  display: flex;
}
.hero-slide h2 {
  font-size: 22px;
  margin: 0 0 8px;
}
@media (min-width: 768px) {
  .hero-slide h2 {
    font-size: 32px;
  }
}
.hero-slide p {
  margin: 0;
  font-size: 13px;
  opacity: 0.95;
}

.hero-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
}
.dot.active {
  background: var(--momo-white);
}
</style>
