export interface HealthTip {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    name: string
    credentials: string
    avatar?: string
    specialization: string
  }
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  likes: number
  bookmarks: number
  views: number
  isLiked: boolean
  isBookmarked: boolean
  imageUrl?: string
  status: "published" | "draft" | "archived"
}

export interface HealthTipCategory {
  id: string
  name: string
  description: string
  count: number
  icon: string
}

export interface HealthTipFilters {
  category?: string
  search?: string
  sortBy?: "latest" | "popular" | "mostLiked" | "mostBookmarked"
  tags?: string[]
}
