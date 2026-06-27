import { defineStore } from 'pinia'
import type { SearchParams } from '~/types/product'

/**
 * 搜尋篩選條件的全域 store，管理排序與分類狀態。
 */
export const useFiltersStore = defineStore('filters', {
  state: () => ({
    sort: 'default' as NonNullable<SearchParams['sort']>,
    category: '' as string,
  }),

  actions: {
    /**
     * 設定排序方式。
     *
     * @param sort - 排序鍵值，對應 `SearchParams['sort']` 的合法值
     */
    setSort(sort: NonNullable<SearchParams['sort']>) {
      this.sort = sort
    },
    /**
     * 設定分類篩選。
     *
     * @param category - 分類 ID；傳入空字串表示不篩選
     */
    setCategory(category: string) {
      this.category = category
    },
    /**
     * 將排序與分類重置為預設值。
     */
    reset() {
      this.sort = 'default'
      this.category = ''
    },
  },
})
