<script setup lang="ts">
import type { LiveStream, Product } from '~/composables/useMockApi'

const api = useMockApi()
const cartStore = useCartStore()
const toast = useToast()

const streams = ref<LiveStream[]>([])
const featuredProducts = ref<Record<string, Product[]>>({})
const isLoading = ref(true)
const activeStreamId = ref<string | null>(null)

onMounted(async () => {
  streams.value = await api.getLiveStreams()
  isLoading.value = false
  activeStreamId.value = streams.value.find((s) => s.isLive)?.id ?? streams.value[0]?.id ?? null

  for (const stream of streams.value) {
    featuredProducts.value[stream.id] = await api.getProductsByIds(stream.featuredProductIds)
  }
})

const activeStream = computed(() => streams.value.find((s) => s.id === activeStreamId.value))
const activeStreamProducts = computed(() =>
  activeStreamId.value ? featuredProducts.value[activeStreamId.value] ?? [] : [],
)

// 模擬直播觀看人數的即時跳動，強化「CSR 才合理」這個渲染策略決策
// 的可觀察性：這種資料每幾秒就變，SSR 渲染出來馬上就是舊的。
let viewerTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  viewerTimer = setInterval(() => {
    streams.value.forEach((s) => {
      if (s.isLive) {
        s.viewerCount = Math.max(0, s.viewerCount + Math.round((Math.random() - 0.4) * 15))
      }
    })
  }, 3000)
})
onUnmounted(() => {
  if (viewerTimer) clearInterval(viewerTimer)
})

function handleAddToCart(product: Product) {
  cartStore.addItem(product)
  toast.show(`已加入購物車：${product.title}`)
}
</script>

<template>
  <div class="page-container live-page">
    <h1 class="section-title"><span class="accent-bar" />momo 直播</h1>

    <div v-if="isLoading" class="loading-placeholder">載入直播列表中...</div>

    <div v-else class="live-layout">
      <!-- 直播列表 -->
      <ul class="stream-list" aria-label="直播列表">
        <li v-for="stream in streams" :key="stream.id">
          <button
            class="stream-item"
            :class="{ active: stream.id === activeStreamId }"
            @click="activeStreamId = stream.id"
          >
            <div
              class="stream-thumb"
              :style="{
                background: `linear-gradient(135deg, ${stream.colorFrom}, ${stream.colorTo})`,
              }"
            >
              <span v-if="stream.isLive" class="live-tag">LIVE</span>
            </div>
            <div class="stream-meta">
              <p class="stream-host">{{ stream.host }}</p>
              <p class="stream-title">{{ stream.title }}</p>
              <p class="viewer-count">
                {{ stream.isLive ? `👁 ${stream.viewerCount} 人觀看` : '已結束' }}
              </p>
            </div>
          </button>
        </li>
      </ul>

      <!-- 主播放區（模擬畫面） -->
      <div v-if="activeStream" class="stream-stage">
        <div
          class="stage-visual"
          :style="{
            background: `linear-gradient(135deg, ${activeStream.colorFrom}, ${activeStream.colorTo})`,
          }"
        >
          <span v-if="activeStream.isLive" class="live-tag large">LIVE</span>
          <p class="stage-title">{{ activeStream.title }}</p>
          <p class="stage-host">{{ activeStream.host }}</p>
        </div>

        <h2 class="featured-title">直播熱銷商品</h2>
        <ProductGrid :products="activeStreamProducts" @add-to-cart="handleAddToCart" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-page {
  padding-top: 16px;
  padding-bottom: 32px;
}
.loading-placeholder {
  padding: 48px 0;
  text-align: center;
  color: var(--momo-text-light);
  font-size: 13px;
}

.live-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 900px) {
  .live-layout {
    flex-direction: row;
  }
}

.stream-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 0 0 auto;
}
@media (min-width: 900px) {
  .stream-list {
    flex: 0 0 280px;
  }
}

.stream-item {
  display: flex;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: var(--momo-white);
  border: 1px solid var(--momo-border);
  border-radius: var(--momo-radius-md);
  padding: 8px;
}
.stream-item.active {
  border-color: var(--momo-pink);
  background: var(--momo-pink-bg);
}

.stream-thumb {
  flex: 0 0 64px;
  height: 64px;
  border-radius: var(--momo-radius-sm);
  position: relative;
}
.live-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  background: var(--momo-pink);
  color: var(--momo-white);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 2px;
}
.live-tag.large {
  position: static;
  display: inline-block;
  font-size: 11px;
  padding: 3px 8px;
  margin-bottom: 8px;
}

.stream-meta {
  flex: 1;
  min-width: 0;
}
.stream-host {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 2px;
}
.stream-title {
  font-size: 12px;
  margin: 0 0 4px;
  color: var(--momo-text-light);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.viewer-count {
  font-size: 11px;
  color: var(--momo-text-light);
  margin: 0;
}

.stream-stage {
  flex: 1;
  min-width: 0;
}
.stage-visual {
  border-radius: var(--momo-radius-md);
  padding: 32px;
  color: var(--momo-white);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.stage-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
}
.stage-host {
  font-size: 13px;
  opacity: 0.9;
  margin: 0;
}

.featured-title {
  font-size: 16px;
  margin: 20px 0 12px;
}
</style>
