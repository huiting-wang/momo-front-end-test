<script setup lang="ts">
import type { Category } from '~/composables/useMockApi'

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <nav class="category-nav" aria-label="商品分類">
    <div class="page-container nav-inner">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="{ path: '/search', query: { category: cat.id } }"
        class="category-item"
      >
        <span class="icon" aria-hidden="true">{{ cat.icon }}</span>
        <span>{{ cat.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.category-nav {
  background: var(--momo-white);
  border-bottom: 1px solid var(--momo-border);
  height: var(--nav-height);
  display: flex;
  align-items: center;
}
.nav-inner {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scrollbar-width: none;
}
.nav-inner::-webkit-scrollbar {
  display: none;
}
.category-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--momo-text);
  white-space: nowrap;
  padding: 4px 2px;
}
.category-item:hover {
  color: var(--momo-pink);
}
</style>
