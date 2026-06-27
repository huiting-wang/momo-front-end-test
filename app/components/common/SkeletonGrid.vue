<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 10 })
</script>

<template>
  <div class="skeleton-grid">
    <div v-for="i in count" :key="i" class="skeleton-card" aria-hidden="true">
      <div class="skeleton-image" />
      <div class="skeleton-line w-90" />
      <div class="skeleton-line w-60" />
      <div class="skeleton-line w-40" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 600px) {
  .skeleton-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 900px) {
  .skeleton-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 1200px) {
  .skeleton-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.skeleton-card {
  background: var(--momo-white);
  border-radius: var(--momo-radius-md);
  padding: 10px;
  box-shadow: var(--shadow-card);
}
.skeleton-image {
  aspect-ratio: 1 / 1;
  background: var(--momo-border);
  border-radius: var(--momo-radius-sm);
  margin-bottom: 8px;
  animation: pulse 1.4s ease-in-out infinite;
}
.skeleton-line {
  height: 10px;
  background: var(--momo-border);
  border-radius: 4px;
  margin-bottom: 6px;
  animation: pulse 1.4s ease-in-out infinite;
}
.w-90 {
  width: 90%;
}
.w-60 {
  width: 60%;
}
.w-40 {
  width: 40%;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
