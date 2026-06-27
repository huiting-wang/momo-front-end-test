<script setup lang="ts">
import type { Product } from '~/composables/useMockApi'

const api = useMockApi()

const { data: banners } = await useAsyncData('home-banners', () => api.getBanners())
const { data: carouselGroups } = await useAsyncData('home-carousels', () =>
  api.getFeaturedCarousel(),
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

    <!-- 商品分類 carousels -->
    <ProductCarousel
      v-for="group in carouselGroups"
      :key="group.category.id"
      :title="`${group.category.icon} ${group.category.name} 熱銷推薦`"
      :products="group.products"
      :view-more-link="`/search?category=${group.category.id}`"
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
