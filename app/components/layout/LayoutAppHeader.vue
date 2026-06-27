<script setup lang="ts">
const cartStore = useCartStore()
const router = useRouter()
const searchInput = ref('')

function handleSearch() {
  router.push({ path: '/search', query: searchInput.value ? { q: searchInput.value } : {} })
}
</script>

<template>
  <header class="site-header">
    <div class="page-container header-inner">
      <NuxtLink to="/" class="logo" aria-label="回到首頁">
        <span class="logo-mark">momo</span><span class="logo-sub">購物網</span>
      </NuxtLink>

      <form class="search-bar" role="search" @submit.prevent="handleSearch">
        <input
          v-model="searchInput"
          type="search"
          placeholder="搜尋商品、品牌"
          aria-label="搜尋商品"
        />
        <button type="submit" aria-label="搜尋">🔍</button>
      </form>

      <nav class="header-actions" aria-label="快速資訊">
        <span
          class="action-link cart-status"
          role="status"
          :aria-label="`購物車內有 ${cartStore.totalCount} 件商品`"
        >
          <span aria-hidden="true">🛒</span> 購物車
          <span v-if="cartStore.totalCount > 0" class="cart-badge" aria-hidden="true">{{
            cartStore.totalCount
          }}</span>
        </span>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--momo-pink);
  height: var(--header-height);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--momo-white);
  flex-shrink: 0;
}
.logo-mark {
  font-size: 22px;
  font-weight: 800;
  font-style: italic;
}
.logo-sub {
  font-size: 12px;
  opacity: 0.9;
}

.search-bar {
  flex: 1;
  max-width: 480px;
  display: flex;
  background: var(--momo-white);
  border-radius: 20px;
  overflow: hidden;
}
.search-bar input {
  flex: 1;
  border: none;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
}
.search-bar button {
  border: none;
  background: transparent;
  padding: 0 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.action-link {
  color: var(--momo-white);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  white-space: nowrap;
}
.cart-status {
  cursor: default;
}
.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #ffd43b;
  color: #2b2b2b;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 640px) {
  .logo-sub {
    display: none;
  }
  .action-link span:not([aria-hidden]) {
    display: none;
  }
}
</style>
