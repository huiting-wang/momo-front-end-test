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

export interface FlashSale {
  id: string
  title: string
  subtitle: string
  endsInSeconds: number
  productIds: string[]
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
