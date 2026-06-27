<script setup lang="ts">
import type { Product } from '~/composables/useMockApi'

const route = useRoute()
const api = useMockApi()
const cartStore = useCartStore()
const toast = useToast()
const { formatPrice, discountPercent, formatSoldCount } = useFormatPrice()
const { getImageUrl } = usePlaceholderImage()

const productId = computed(() => route.params.id as string)

const { data: product } = await useAsyncData(
  () => `goods-${productId.value}`,
  () => api.getProductById(productId.value),
  { watch: [productId] },
)

// 找不到商品時回應 404，讓 SSR 對搜尋引擎與爬蟲呈現正確的狀態碼，
// 這是商品頁選擇 SSR 的另一個理由：CSR-only 沒辦法做到這件事。
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到此商品' })
}

const { data: relatedProducts } = await useAsyncData(
  () => `related-${productId.value}`,
  () => api.getRelatedProducts(product.value!, 8),
  { watch: [productId] },
)

const quantity = ref(1)
const discount = computed(() =>
  discountPercent(product.value!.price, product.value!.originalPrice),
)
const soldLabel = computed(() => formatSoldCount(product.value!.soldCount))
const imageUrl = computed(() => getImageUrl(product.value!.imageSeed, product.value!.brand))

function handleAddToCart() {
  cartStore.addItem(product.value!, quantity.value)
  toast.show(`已加入購物車：${product.value!.title} x${quantity.value}`)
}

function handleAddRelated(p: Product) {
  cartStore.addItem(p)
  toast.show(`已加入購物車：${p.title}`)
}

useHead(() => ({
  title: `${product.value?.title ?? '商品'} - momo購物網`,
  meta: [{ name: 'description', content: product.value?.title ?? '' }],
}))
</script>

<template>
  <div v-if="product" class="page-container goods-page">
    <Breadcrumb
      :items="[
        { label: '首頁', to: '/' },
        { label: product.category, to: `/search?category=${product.category}` },
        { label: product.title },
      ]"
    />

    <div class="goods-main">
      <div class="goods-image">
        <img :src="imageUrl" :alt="product.title" width="480" height="480" />
        <span v-if="discount" class="discount-badge">折扣 {{ discount }}%</span>
      </div>

      <div class="goods-info">
        <p v-if="product.brand" class="brand">{{ product.brand }}</p>
        <h1 class="title">{{ product.title }}</h1>

        <RatingStars :rating="product.rating" :review-count="product.reviewCount" />

        <div class="badges">
          <span v-for="b in product.badges" :key="b" class="badge">{{ b }}</span>
        </div>

        <div class="price-block">
          <span class="price">$ {{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="original-price"
            >$ {{ formatPrice(product.originalPrice) }}</span
          >
        </div>

        <p v-if="soldLabel" class="sold-count">{{ soldLabel }}</p>

        <div class="quantity-row">
          <span class="qty-label" id="qty-label">數量</span>
          <div class="qty-stepper" role="group" aria-labelledby="qty-label">
            <button
              type="button"
              aria-label="減少數量"
              :disabled="quantity <= 1"
              @click="quantity--"
            >
              −
            </button>
            <span class="qty-value" aria-live="polite">{{ quantity }}</span>
            <button type="button" aria-label="增加數量" @click="quantity++">+</button>
          </div>
        </div>

        <div class="action-row">
          <button class="btn-primary buy-btn" type="button" @click="handleAddToCart">
            加入購物車
          </button>
          <NuxtLink to="/cart" class="btn-secondary">查看購物車</NuxtLink>
        </div>

        <div class="delivery-info">
          <p>🚚 24h到貨．超商取貨付款</p>
          <p>↩️ 享7天鑑賞期，不滿意可退換貨</p>
        </div>
      </div>
    </div>

    <ProductCarousel
      v-if="relatedProducts?.length"
      title="猜你喜歡"
      :products="relatedProducts"
      @add-to-cart="handleAddRelated"
    />
  </div>
</template>

<style scoped>
.goods-page {
  padding-bottom: 32px;
}

.goods-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--momo-white);
  border-radius: var(--momo-radius-md);
  padding: 16px;
}
@media (min-width: 768px) {
  .goods-main {
    flex-direction: row;
    padding: 24px;
  }
}

.goods-image {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  max-width: 360px;
  aspect-ratio: 1 / 1;
  background: var(--momo-bg);
  border-radius: var(--momo-radius-md);
  overflow: hidden;
}
.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--momo-pink);
  color: var(--momo-white);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: var(--momo-radius-sm);
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.brand {
  font-size: 12px;
  color: var(--momo-text-light);
  margin: 0;
}
.title {
  font-size: 20px;
  margin: 0;
  line-height: 1.4;
}

.badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.badge {
  font-size: 11px;
  color: var(--momo-pink);
  border: 1px solid var(--momo-pink);
  border-radius: 2px;
  padding: 2px 6px;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 6px;
}
.price {
  font-size: 28px;
  font-weight: 800;
  color: var(--momo-pink);
}
.original-price {
  font-size: 14px;
  color: var(--momo-text-light);
  text-decoration: line-through;
}
.sold-count {
  font-size: 12px;
  color: var(--momo-text-light);
  margin: 0;
}

.quantity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.qty-label {
  font-size: 13px;
}
.qty-stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--momo-border);
  border-radius: var(--momo-radius-sm);
}
.qty-stepper button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 16px;
}
.qty-stepper button:disabled {
  opacity: 0.3;
}
.qty-value {
  width: 32px;
  text-align: center;
  font-size: 14px;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.buy-btn {
  flex: 1;
  padding: 12px 20px;
  font-size: 15px;
}

.delivery-info {
  margin-top: 12px;
  font-size: 12px;
  color: var(--momo-text-light);
  border-top: 1px dashed var(--momo-border);
  padding-top: 12px;
}
.delivery-info p {
  margin: 0 0 4px;
}
</style>
