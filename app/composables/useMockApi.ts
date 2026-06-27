import productsData from '~/data/products.json'
import categoriesData from '~/data/categories.json'
import bannersData from '~/data/banners.json'
import flashSaleData from '~/data/flashSale.json'
import type {
  Product,
  Category,
  Banner,
  FlashSale,
  SearchParams,
  SearchResult,
} from '~/types/product'

const allProducts = productsData as Product[]
const allCategories = categoriesData as Category[]
const allBanners = bannersData as Banner[]
const flashSale = flashSaleData as FlashSale

/**
 * 模擬網路延遲
 *
 * @remarks
 *
 * 讓 loading/skeleton 狀態有意義可以被觀察到，也讓 SSR/CSR 差異在開發時更容易被肉眼驗證。
 */
function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * useMockApi - 將所有 mock 資料存取統一收斂在這個 composable，
 * 對外的函式簽名模擬未來真實 API 會有的形狀（query params、
 * pagination、async），降低未來切換成真實後端的改動成本。
 */
export function useMockApi() {
  async function getCategories(): Promise<Category[]> {
    await delay(50)
    return allCategories
  }

  async function getBanners(): Promise<Banner[]> {
    await delay(80)
    return allBanners
  }

  async function getProductById(id: string): Promise<Product | null> {
    await delay(120)
    return allProducts.find((p) => p.id === id) ?? null
  }

  async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
    await delay(120)
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit)
  }

  async function getProductsByCategory(categoryId: string, limit = 10): Promise<Product[]> {
    await delay(100)
    return allProducts.filter((p) => p.category === categoryId).slice(0, limit)
  }

  async function getFeaturedCarousel(): Promise<{ category: Category; products: Product[] }[]> {
    await delay(150)
    return allCategories.slice(0, 5).map((cat) => ({
      category: cat,
      products: allProducts.filter((p) => p.category === cat.id).slice(0, 10),
    }))
  }

  async function search(params: SearchParams): Promise<SearchResult> {
    await delay(200)
    let results = [...allProducts]

    if (params.q) {
      const q = params.q.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    if (params.category) {
      results = results.filter((p) => p.category === params.category)
    }

    switch (params.sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'sold-desc':
        results.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
        break
      default:
        break
    }

    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20
    const total = results.length
    const start = (page - 1) * pageSize
    const items = results.slice(start, start + pageSize)

    return { items, total, page, pageSize }
  }

  async function getProductsByIds(ids: string[]): Promise<Product[]> {
    await delay(100)
    return ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
  }


  /**
   * 降價：originalPrice 存在且高於 price 的商品，依折扣幅度排序，
   *
   * @remarks
   * 折扣最深的排最前面
   */
  async function getDiscountedProducts(limit = 10): Promise<Product[]> {
    await delay(120)
    return allProducts
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => {
        const discountA = a.originalPrice ? 1 - a.price / a.originalPrice : 0
        const discountB = b.originalPrice ? 1 - b.price / b.originalPrice : 0
        return discountB - discountA
      })
      .slice(0, limit)
  }

  /**
   * 今日促銷：依 discountTag 標記篩選（活動驅動，而非價格驅動）
   */
  async function getTodayPromotions(limit = 10): Promise<Product[]> {
    await delay(120)
    return allProducts.filter((p) => Boolean(p.discountTag)).slice(0, limit)
  }

  /**
   * 限時搶購
   */
  async function getFlashSale(): Promise<{ sale: FlashSale; products: Product[]; endsAt: number }> {
    await delay(150)
    const products = await getProductsByIds(flashSale.productIds)
    return {
      sale: flashSale,
      products,
      endsAt: Date.now() + flashSale.endsInSeconds * 1000,
    }
  }

  /**
   * 會員訂閱專屬商品
   */
  async function getMemberExclusive(limit = 10): Promise<Product[]> {
    await delay(120)
    return allProducts
      .filter((p) => p.badges.some((b) => b.includes('獨家') || b.includes('自營')))
      .slice(0, limit)
  }

  /**
   * 推薦商品：跨分類混合取樣，模擬「綜合推薦」而非單一分類陳列
   */
  async function getRecommended(limit = 10): Promise<Product[]> {
    await delay(150)
    const step = Math.max(1, Math.floor(allProducts.length / limit))
    const picked: Product[] = []
    for (let i = 0; i < allProducts.length && picked.length < limit; i += step) {
      const product = allProducts[i]
      if (product) picked.push(product)
    }
    return picked
  }

  return {
    getCategories,
    getBanners,
    getProductById,
    getRelatedProducts,
    getProductsByCategory,
    getFeaturedCarousel,
    search,
    getProductsByIds,
    getDiscountedProducts,
    getTodayPromotions,
    getFlashSale,
    getMemberExclusive,
    getRecommended,
  }
}
