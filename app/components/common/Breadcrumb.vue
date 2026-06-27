<script setup lang="ts">
defineProps<{
  items: { label: string; to?: string }[]
}>()
</script>

<template>
  <nav class="breadcrumb" aria-label="麵包屑導覽">
    <ol>
      <li v-for="(item, i) in items" :key="i">
        <NuxtLink v-if="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page">{{ item.label }}</span>
        <span v-if="i < items.length - 1" class="sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  padding: 12px 0;
  font-size: 12px;
  color: var(--momo-text-light);
}
.breadcrumb ol {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.breadcrumb li {
  display: flex;
  align-items: center;
  gap: 6px;
}
.breadcrumb a:hover {
  color: var(--momo-pink);
}
.sep {
  margin: 0 2px;
}
</style>
