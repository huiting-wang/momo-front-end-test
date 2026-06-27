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
  <div class="product-grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="emit('addToCart', $event)"
    />
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
