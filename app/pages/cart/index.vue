<script setup lang="ts">
const cartStore = useCartStore()
const { formatPrice } = useFormatPrice()
const { getImageUrl } = usePlaceholderImage()

const shippingThreshold = 990
const remainingForFreeShipping = computed(() =>
  Math.max(0, shippingThreshold - cartStore.totalPrice),
)
</script>

<template>
  <div class="page-container cart-page">
    <h1 class="section-title"><span class="accent-bar" />購物車</h1>

    <EmptyState
      v-if="cartStore.items.length === 0"
      title="購物車是空的"
      message="去逛逛，把喜歡的商品加進來吧"
    >
      <NuxtLink to="/" class="btn-primary">繼續購物</NuxtLink>
    </EmptyState>

    <div v-else class="cart-layout">
      <ul class="cart-items">
        <li v-for="item in cartStore.items" :key="item.product.id" class="cart-item">
          <NuxtLink :to="`/goods/${item.product.id}`" class="item-image">
            <img
              :src="getImageUrl(item.product.imageSeed, item.product.brand)"
              :alt="item.product.title"
              width="80"
              height="80"
            />
          </NuxtLink>

          <div class="item-info">
            <NuxtLink :to="`/goods/${item.product.id}`" class="item-title">{{
              item.product.title
            }}</NuxtLink>
            <p class="item-price">$ {{ formatPrice(item.product.price) }}</p>
          </div>

          <div class="qty-stepper" role="group" :aria-label="`${item.product.title} 數量`">
            <button
              type="button"
              aria-label="減少數量"
              @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
            >
              −
            </button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button
              type="button"
              aria-label="增加數量"
              @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
            >
              +
            </button>
          </div>

          <p class="item-subtotal">
            $ {{ formatPrice(item.product.price * item.quantity) }}
          </p>

          <button
            class="remove-btn"
            type="button"
            :aria-label="`移除 ${item.product.title}`"
            @click="cartStore.removeItem(item.product.id)"
          >
            ✕
          </button>
        </li>
      </ul>

      <aside class="cart-summary">
        <p v-if="remainingForFreeShipping > 0" class="shipping-hint">
          再買 $ {{ formatPrice(remainingForFreeShipping) }} 即可享免運
        </p>
        <p v-else class="shipping-hint success">🎉 已享免運資格</p>

        <div class="summary-row">
          <span>商品總計</span>
          <span>$ {{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <div class="summary-row total">
          <span>應付金額</span>
          <span>$ {{ formatPrice(cartStore.totalPrice) }}</span>
        </div>

        <button class="btn-primary checkout-btn" type="button" disabled>
          前往結帳（純前端 Demo 未實作）
        </button>
        <p class="checkout-note">本練習專案不含真實結帳流程</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding-top: 16px;
  padding-bottom: 32px;
}

.cart-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 900px) {
  .cart-layout {
    flex-direction: row;
  }
}

.cart-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-item {
  display: grid;
  grid-template-columns: 64px 1fr auto auto auto;
  align-items: center;
  gap: 12px;
  background: var(--momo-white);
  border-radius: var(--momo-radius-md);
  padding: 10px;
  box-shadow: var(--shadow-card);
}

.item-image img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--momo-radius-sm);
}

.item-info {
  min-width: 0;
}
.item-title {
  font-size: 13px;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.item-title:hover {
  color: var(--momo-pink);
}
.item-price {
  font-size: 12px;
  color: var(--momo-text-light);
  margin: 4px 0 0;
}

.qty-stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--momo-border);
  border-radius: var(--momo-radius-sm);
}
.qty-stepper button {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  font-size: 14px;
}
.qty-value {
  width: 28px;
  text-align: center;
  font-size: 13px;
}

.item-subtotal {
  font-size: 14px;
  font-weight: 700;
  color: var(--momo-pink);
  white-space: nowrap;
}

.remove-btn {
  background: transparent;
  border: none;
  color: var(--momo-text-light);
  font-size: 14px;
  padding: 4px;
}
.remove-btn:hover {
  color: var(--momo-pink);
}

.cart-summary {
  flex: 0 0 280px;
  background: var(--momo-white);
  border-radius: var(--momo-radius-md);
  padding: 16px;
  align-self: flex-start;
  box-shadow: var(--shadow-card);
}
.shipping-hint {
  font-size: 12px;
  color: var(--momo-orange);
  margin: 0 0 12px;
}
.shipping-hint.success {
  color: var(--momo-success);
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
  color: var(--momo-text-light);
}
.summary-row.total {
  font-size: 16px;
  font-weight: 700;
  color: var(--momo-text);
  border-top: 1px dashed var(--momo-border);
  padding-top: 8px;
}
.checkout-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  opacity: 0.6;
  cursor: not-allowed;
}
.checkout-note {
  font-size: 11px;
  color: var(--momo-text-light);
  text-align: center;
  margin: 6px 0 0;
}
</style>
