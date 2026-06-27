<script setup lang="ts">
import type { FlashSale, Product } from '~/types/product'

const props = defineProps<{
  sale: FlashSale
  products: Product[]
  endsAt: number
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
}>()

// 純前端相對時間倒數：以伺服器（mock）算好的絕對時間戳 endsAt 為基準，
// 每秒重新計算剩餘秒數。不做伺服器時間校正，是時間盒下合理的精度
// 取捨（見 docs/phase1-design-notes.md Tradeoff 1）。
const remainingSeconds = ref(Math.max(0, Math.round((props.endsAt - Date.now()) / 1000)))
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    remainingSeconds.value = Math.max(0, Math.round((props.endsAt - Date.now()) / 1000))
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const countdownLabel = computed(() => {
  const total = remainingSeconds.value
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})

const isEnded = computed(() => remainingSeconds.value <= 0)
</script>

<template>
  <section class="flash-sale" aria-label="限時搶購">
    <div class="flash-header">
      <h2 class="flash-title">
        <span class="flash-icon" aria-hidden="true">⚡</span>
        {{ sale.title }}
      </h2>
      <p class="flash-subtitle">{{ sale.subtitle }}</p>

      <div class="countdown" role="timer" aria-live="off">
        <span v-if="!isEnded" class="countdown-label">距離結束</span>
        <span v-else class="countdown-label ended">本檔已結束</span>
        <span v-if="!isEnded" class="countdown-value">{{ countdownLabel }}</span>
      </div>
    </div>

    <div class="flash-track">
      <div v-for="product in products" :key="product.id" class="flash-item">
        <ProductCard :product="product" @add-to-cart="emit('addToCart', $event)" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.flash-sale {
  background: linear-gradient(135deg, #fff0f0, #ffe3ec);
  border-radius: var(--momo-radius-md);
  padding: 16px;
  margin: 20px 0;
}

.flash-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}
.flash-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--momo-pink-dark);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
.flash-icon {
  font-size: 18px;
}
.flash-subtitle {
  font-size: 12px;
  color: var(--momo-text-light);
  margin: 0;
}

.countdown {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2b2b2b;
  color: var(--momo-white);
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
}
.countdown-label.ended {
  color: #ffd43b;
}
.countdown-value {
  font-family: 'SF Mono', Consolas, monospace;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.flash-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.flash-track::-webkit-scrollbar {
  display: none;
}
.flash-item {
  flex: 0 0 160px;
  scroll-snap-align: start;
}
@media (min-width: 768px) {
  .flash-item {
    flex: 0 0 200px;
  }
}
</style>
