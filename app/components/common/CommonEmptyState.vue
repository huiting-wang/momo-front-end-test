<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: '找不到相關商品',
    message: '試試其他關鍵字，或瀏覽推薦分類',
  },
)
</script>

<template>
  <div class="empty-state">
    <p class="icon" aria-hidden="true">🔍</p>
    <p class="title">{{ title }}</p>
    <p class="message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: var(--momo-text-light);
}
.icon {
  font-size: 40px;
  margin: 0 0 8px;
}
.title {
  font-size: 16px;
  font-weight: 700;
  color: var(--momo-text);
  margin: 0 0 4px;
}
.message {
  font-size: 13px;
  margin: 0;
}
</style>
