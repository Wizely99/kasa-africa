"use server"

import type { HealthPost, CreatePostRequest, PostCategory } from "../types/post"

const mockCategories: PostCategory[] = [
  { id: "1", name: "Nutrition", description: "Diet and nutrition advice", color: "#10B981" },
  { id: "2", name: "Exercise", description: "Fitness and physical activity", color: "#3B82F6" },
  { id: "3", name: "Mental Health", description: "Psychological wellbeing", color: "#8B5CF6" },
  { id: "4", name: "Preventive Care", description: "Disease prevention tips", color: "#F59E0B" },
  { id: "5", name: "Chronic Conditions", description: "Managing long-term health issues", color: "#EF4444" },
]

const mockPosts: HealthPost[] = [
  {
    id: "1",
    title: "10 Essential Tips for Heart Health",
    content: `<h2>Introduction</h2><p>Heart disease remains one of the leading causes of death worldwide, but the good news is that many heart conditions are preventable through lifestyle changes...</p>`,
    excerpt:
      "Discover evidence-based strategies to maintain a healthy heart and reduce your risk of cardiovascular disease.",
    author: "Dr. Emily Carter",
    authorId: "doctor-1",
    category: "Preventive Care",
    tags: ["heart health", "prevention", "lifestyle"],
    status: "published",
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    views: 1250,
    likes: 89,
    featuredImage: "/placeholder.svg?height=400&width=800",
  },
]

export async function getPostsAction(category?: string, status?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredPosts = mockPosts

  if (category && category !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.category === category)
  }

  if (status && status !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.status === status)
  }

  return { success: true, data: filteredPosts }
}

export async function getPostCategoriesAction() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return { success: true, data: mockCategories }
}

export async function createPostAction(data: CreatePostRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const readTime = Math.ceil(data.content.length / 1000) // Rough estimate

  const newPost: HealthPost = {
    id: `post-${Date.now()}`,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    author: "Current User", // Replace with actual user
    authorId: "current-user-id",
    category: data.category,
    tags: data.tags,
    status: data.status,
    publishedAt: data.status === "published" ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime,
    views: 0,
    likes: 0,
    featuredImage: data.featuredImage ? "/placeholder.svg?height=400&width=800" : undefined,
  }

  return {
    success: true,
    data: newPost,
    message: `Post ${data.status === "published" ? "published" : "saved as draft"} successfully!`,
  }
}
