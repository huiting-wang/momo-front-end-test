<script setup lang="ts">
const { state } = useToast()
</script>

<template>
  <Transition name="toast-fade">
    <div v-if="state.visible" class="app-toast" role="status" aria-live="polite">
      {{ state.message }}
    </div>
  </Transition>
</template>

<style scoped>
.app-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(43, 43, 43, 0.92);
  color: var(--momo-white);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 100;
  white-space: nowrap;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
