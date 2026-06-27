import { defineStore } from 'pinia'
import type { Product } from '~/types/product'
import type { CartItem } from '~/types/cart'

/**
 * 購物車全域 store，管理購物車品項的新增、移除與數量更新。
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /** 購物車內所有商品的總件數。 */
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    /** 購物車內所有商品的總金額（單價 × 數量加總）。 */
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  },

  actions: {
    /**
     * 將商品加入購物車；若已存在則累加數量。
     *
     * @param product - 要加入的商品
     * @param quantity - 加入數量，預設 1
     */
    addItem(product: Product, quantity = 1) {
      const existing = this.items.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
    },

    /**
     * 從購物車移除指定商品。
     *
     * @param productId - 要移除的商品 ID
     */
    removeItem(productId: string) {
      this.items = this.items.filter((item) => item.product.id !== productId)
    },

    /**
     * 更新指定商品的數量；若數量 ≤ 0 則直接移除該商品。
     *
     * @param productId - 目標商品 ID
     * @param quantity - 新的數量
     */
    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId)
      if (!item) return
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
      }
    },

    /**
     * 清空購物車所有品項。
     */
    clear() {
      this.items = []
    },
  },
})
