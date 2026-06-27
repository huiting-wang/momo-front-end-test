import { defineStore } from 'pinia'
import type { Product } from '~/composables/useMockApi'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  },

  actions: {
    addItem(product: Product, quantity = 1) {
      const existing = this.items.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
    },

    removeItem(productId: string) {
      this.items = this.items.filter((item) => item.product.id !== productId)
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId)
      if (!item) return
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
      }
    },

    clear() {
      this.items = []
    },
  },
})
