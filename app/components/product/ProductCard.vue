<script setup lang="ts">
import type { Product } from '~/composables/useMockApi'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
}>()

const { formatPrice, discountPercent, formatSoldCount } = useFormatPrice()
const { getImageUrl } = usePlaceholderImage()

const discount = computed(() => discountPercent(props.product.price, props.product.originalPrice))
const soldLabel = computed(() => formatSoldCount(props.product.soldCount))
const imageUrl = computed(() => getImageUrl(props.product.imageSeed, props.product.brand))

function handleAddToCart(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  emit('addToCart', props.product)
}
</script>

<template>
  <NuxtLink :to="`/goods/${product.id}`" class="product-card">
    <div class="image-wrap">
      <img :src="imageUrl" :alt="product.title" loading="lazy" width="200" height="200" />
      <span v-if="discount" class="discount-badge">-{{ discount }}%</span>
    </div>

    <div class="card-body">
      <p class="title">{{ product.title }}</p>

      <div class="badges" v-if="product.badges.length">
        <span v-for="b in product.badges.slice(0, 2)" :key="b" class="badge">{{ b }}</span>
      </div>

      <RatingStars :rating="product.rating" :review-count="product.reviewCount" />

      <div class="price-row">
        <span class="price">$ {{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="original-price"
          >$ {{ formatPrice(product.originalPrice) }}</span
        >
      </div>

      <p v-if="soldLabel" class="sold-count">{{ soldLabel }}</p>

      <button
        class="add-cart-btn"
        type="button"
        aria-label="加入購物車"
        @click="handleAddToCart"
      >
        加入購物車
      </button>
    </div>
  </NuxtLink>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--momo-white);
  border-radius: var(--momo-radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  height: 100%;
}
.product-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.product-card:focus-visible {
  outline: 2px solid var(--momo-pink);
  outline-offset: 2px;
}

.image-wrap {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--momo-bg);
}
.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--momo-pink);
  color: var(--momo-white);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--momo-radius-sm);
}

.card-body {
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.title {
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
  color: var(--momo-text);
}

.badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.badge {
  font-size: 10px;
  color: var(--momo-pink);
  border: 1px solid var(--momo-pink);
  border-radius: 2px;
  padding: 1px 4px;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 2px;
}
.price {
  font-size: 16px;
  font-weight: 700;
  color: var(--momo-pink);
}
.original-price {
  font-size: 12px;
  color: var(--momo-text-light);
  text-decoration: line-through;
}

.sold-count {
  font-size: 11px;
  color: var(--momo-text-light);
  margin: 0;
}

.add-cart-btn {
  margin-top: auto;
  background: var(--momo-pink-bg);
  color: var(--momo-pink);
  border: none;
  border-radius: var(--momo-radius-sm);
  padding: 6px 0;
  font-size: 12px;
  font-weight: 600;
}
.add-cart-btn:hover {
  background: var(--momo-pink);
  color: var(--momo-white);
}
</style>
