<script setup lang="ts">
defineProps<{
  rating: number
  reviewCount?: number
}>()
</script>

<template>
  <div class="rating-stars" :aria-label="`評分 ${rating} 分`">
    <span class="stars" aria-hidden="true">
      <span
        v-for="i in 5"
        :key="i"
        class="star"
        :class="{ filled: i <= Math.round(rating) }"
        >★</span
      >
    </span>
    <span v-if="reviewCount" class="review-count">({{ reviewCount }})</span>
  </div>
</template>

<style scoped>
.rating-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.stars {
  display: inline-flex;
}
.star {
  color: #d9d9d9;
  font-size: 12px;
}
.star.filled {
  color: #ffb800;
}
.review-count {
  color: var(--momo-text-light);
}
</style>
