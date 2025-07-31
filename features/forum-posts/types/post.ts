export interface HealthPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  authorId: string
  category: string
  tags: string[]
  featuredImage?: string
  status: "draft" | "published" | "archived"
  publishedAt?: string
  createdAt: string
  updatedAt: string
  readTime: number
  views: number
  likes: number
}

export interface CreatePostRequest {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage?: File
  status: "draft" | "published"
}

export interface PostCategory {
  id: string
  name: string
  description: string
  color: string
}
