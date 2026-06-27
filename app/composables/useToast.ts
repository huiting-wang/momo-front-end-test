import type { ToastState } from '~/types/toast'

const state = reactive<ToastState>({ message: '', visible: false })
let hideTimer: ReturnType<typeof setTimeout> | undefined

/**
 * 極簡 toast 通知，全站共用單一狀態（不用 store 是因為這純粹是
 * UI 暫態，不需要被序列化或跨 SSR 還原，用 module-level reactive
 * 即可）。AppToast.vue 負責渲染，這裡只管狀態。
 */
export function useToast() {
  /**
   * 顯示 toast 通知，並在 `duration` 毫秒後自動隱藏。
   * 若上一則通知尚未消失，會先取消其計時器再重新計時。
   *
   * @param message - 要顯示的訊息文字
   * @param duration - 自動隱藏的延遲毫秒數，預設 2200
   */
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
