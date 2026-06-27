import productsData from '~/data/products.json'
import categoriesData from '~/data/categories.json'
import bannersData from '~/data/banners.json'
import liveStreamsData from '~/data/liveStreams.json'

export interface Product {
  id: string
  title: string
  brand?: string
  price: number
  originalPrice?: number | null
  discountTag?: string | null
  badges: string[]
  imageSeed: string
  rating: number
  reviewCount: number
  soldCount?: number | null
  category: string
  tags: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  colorFrom: string
  colorTo: string
  linkCategory: string
}

export interface LiveStream {
  id: string
  host: string
  title: string
  viewerCount: number
  category: string
  isLive: boolean
  colorFrom: string
  colorTo: string
  featuredProductIds: string[]
}

const allProducts = productsData as Product[]
const allCategories = categoriesData as Category[]
const allBanners = bannersData as Banner[]
const allLiveStreams = liveStreamsData as LiveStream[]

/**
 * 模擬網路延遲，讓 loading/skeleton 狀態有意義可以被觀察到，
 * 也讓 SSR/CSR 差異在開發時更容易被肉眼驗證。
 */
function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface SearchParams {
  q?: string
  category?: string
  sort?: 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'sold-desc'
  page?: number
  pageSize?: number
}

export interface SearchResult {
  items: Product[]
  total: number
  page: number
  pageSize: number
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

  async function getDiscoverFeed(page = 1, pageSize = 12): Promise<Product[]> {
    await delay(250)
    // 探索頁刻意打散順序，模擬「個人化推薦」的隨機感
    const shuffled = [...allProducts].sort((a, b) => {
      const seedA = a.id.charCodeAt(1) + page
      const seedB = b.id.charCodeAt(1) + page
      return ((seedA * 17) % 7) - ((seedB * 17) % 7)
    })
    const start = (page - 1) * pageSize
    return shuffled.slice(start, start + pageSize)
  }

  async function getLiveStreams(): Promise<LiveStream[]> {
    await delay(150)
    return allLiveStreams
  }

  async function getLiveStreamById(id: string): Promise<LiveStream | null> {
    await delay(100)
    return allLiveStreams.find((s) => s.id === id) ?? null
  }

  async function getProductsByIds(ids: string[]): Promise<Product[]> {
    await delay(100)
    return ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
  }

  return {
    getCategories,
    getBanners,
    getProductById,
    getRelatedProducts,
    getProductsByCategory,
    getFeaturedCarousel,
    search,
    getDiscoverFeed,
    getLiveStreams,
    getLiveStreamById,
    getProductsByIds,
  }
}
