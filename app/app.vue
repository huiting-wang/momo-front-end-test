<script setup lang="ts">
const { data: categories } = await useAsyncData('global-categories', () =>
  useMockApi().getCategories(),
)
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <LayoutAppHeader />
    <LayoutCategoryNav v-if="categories" :categories="categories" />
    <main id="main-content">
      <NuxtPage />
    </main>
    <LayoutAppFooter />
    <CommonAppToast />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}
</style>
