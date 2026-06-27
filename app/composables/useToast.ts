interface ToastState {
  message: string
  visible: boolean
}

const state = reactive<ToastState>({ message: '', visible: false })
let hideTimer: ReturnType<typeof setTimeout> | undefined

/**
 * 極簡 toast 通知，全站共用單一狀態（不用 store 是因為這純粹是
 * UI 暫態，不需要被序列化或跨 SSR 還原，用 module-level reactive
 * 即可）。AppToast.vue 負責渲染，這裡只管狀態。
 */
export function useToast() {
  function show(message: string, duration = 2200) {
    state.message = message
    state.visible = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      state.visible = false
    }, duration)
  }

  return { state, show }
}
