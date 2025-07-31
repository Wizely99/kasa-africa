export interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  postCount: number
  lastPost?: {
    id: string
    title: string
    author: string
    createdAt: string
  }
  isSubscribed: boolean
  color: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
    joinDate: string
  }
  category: {
    id: string
    name: string
    color: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  bookmarks: number
  views: number
  comments: number
  isLiked: boolean
  isBookmarked: boolean
  isPinned: boolean
  isLocked: boolean
  status: "active" | "locked" | "archived"
}

export interface ForumComment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  postId: string
  parentId?: string
  createdAt: string
  updatedAt: string
  likes: number
  isLiked: boolean
  replies: ForumComment[]
}

export interface ForumFilters {
  category?: string
  search?: string
  sortBy?: "latest" | "popular" | "mostLiked" | "mostCommented"
  subscribedOnly?: boolean
  tags?: string[]
}
