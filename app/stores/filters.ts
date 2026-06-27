import { defineStore } from 'pinia'
import type { SearchParams } from '~/composables/useMockApi'

export const useFiltersStore = defineStore('filters', {
  state: () => ({
    sort: 'default' as NonNullable<SearchParams['sort']>,
    category: '' as string,
  }),

  actions: {
    setSort(sort: NonNullable<SearchParams['sort']>) {
      this.sort = sort
    },
    setCategory(category: string) {
      this.category = category
    },
    reset() {
      this.sort = 'default'
      this.category = ''
    },
  },
})
