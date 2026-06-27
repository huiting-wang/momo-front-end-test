<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  title: string
  products: Product[]
  viewMoreLink?: string
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
}>()

const scrollRef = ref<HTMLElement | null>(null)

function scrollBy(amount: number) {
  scrollRef.value?.scrollBy({ left: amount, behavior: 'smooth' })
}
</script>

<template>
  <section class="carousel-section">
    <div class="carousel-header">
      <h2 class="section-title"><span class="accent-bar" />{{ title }}</h2>
      <NuxtLink v-if="viewMoreLink" :to="viewMoreLink" class="view-more">查看更多 &gt;</NuxtLink>
    </div>

    <div class="carousel-wrap">
      <button
        class="scroll-btn left"
        type="button"
        aria-label="向左滑動"
        @click="scrollBy(-600)"
      >
        ‹
      </button>

      <div ref="scrollRef" class="carousel-track">
        <div v-for="product in products" :key="product.id" class="carousel-item">
          <ProductCard :product="product" @add-to-cart="emit('addToCart', $event)" />
        </div>
      </div>

      <button
        class="scroll-btn right"
        type="button"
        aria-label="向右滑動"
        @click="scrollBy(600)"
      >
        ›
      </button>
    </div>
  </section>
</template>

<style scoped>
.carousel-section {
  margin-bottom: 16px;
}
.carousel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.section-title {
  margin: 24px 0 12px;
}
.view-more {
  font-size: 13px;
  color: var(--momo-text-light);
}
.view-more:hover {
  color: var(--momo-pink);
}

.carousel-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 160px;
  scroll-snap-align: start;
}
@media (min-width: 768px) {
  .carousel-item {
    flex: 0 0 200px;
  }
}

.scroll-btn {
  display: none;
  position: absolute;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--momo-border);
  background: var(--momo-white);
  box-shadow: var(--shadow-card);
  font-size: 18px;
  line-height: 1;
  align-items: center;
  justify-content: center;
}
.scroll-btn.left {
  left: -12px;
}
.scroll-btn.right {
  right: -12px;
}
@media (min-width: 768px) {
  .scroll-btn {
    display: flex;
  }
}
.scroll-btn:hover {
  border-color: var(--momo-pink);
  color: var(--momo-pink);
}
</style>
