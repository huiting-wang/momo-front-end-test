<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
}>()
</script>

<template>
  <section class="member-section" aria-label="會員訂閱專屬商品">
    <div class="member-header">
      <h2 class="member-title">
        <span class="crown" aria-hidden="true">👑</span>
        會員訂閱專屬
      </h2>
      <p class="member-subtitle">
        此區塊為視覺示範，本練習專案未實作真實會員驗證機制
      </p>
    </div>

    <div class="member-track">
      <div v-for="product in products" :key="product.id" class="member-item">
        <ProductCard :product="product" @add-to-cart="emit('addToCart', $event)" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.member-section {
  background: linear-gradient(135deg, #2b2b3d, #44415a);
  border-radius: var(--momo-radius-md);
  padding: 16px;
  margin: 20px 0;
}

.member-header {
  margin-bottom: 12px;
}
.member-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffd43b;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.crown {
  font-size: 18px;
}
.member-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.member-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.member-track::-webkit-scrollbar {
  display: none;
}
.member-item {
  flex: 0 0 160px;
  scroll-snap-align: start;
}
@media (min-width: 768px) {
  .member-item {
    flex: 0 0 200px;
  }
}
</style>
