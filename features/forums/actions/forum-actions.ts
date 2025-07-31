"use server"

import type { ForumCategory, ForumPost, ForumComment, ForumFilters } from "../types/forum"

// Mock data
const mockCategories: ForumCategory[] = [
  {
    id: "general",
    name: "General Health",
    description: "General health discussions and questions",
    icon: "shield",
    postCount: 342,
    lastPost: {
      id: "1",
      title: "Tips for staying healthy during winter",
      author: "Dr. Sarah Johnson",
      createdAt: "2024-01-15T10:30:00Z",
    },
    isSubscribed: true,
    color: "blue",
  },
  {
    id: "mental-health",
    name: "Mental Health",
    description: "Mental health support and discussions",
    icon: "brain",
    postCount: 189,
    lastPost: {
      id: "2",
      title: "Managing anxiety in daily life",
      author: "Dr. Michael Chen",
      createdAt: "2024-01-14T15:45:00Z",
    },
    isSubscribed: false,
    color: "green",
  },
  {
    id: "nutrition",
    name: "Nutrition & Diet",
    description: "Healthy eating and nutrition advice",
    icon: "apple",
    postCount: 267,
    lastPost: {
      id: "3",
      title: "Meal planning for diabetes management",
      author: "Dr. Lisa Brown",
      createdAt: "2024-01-13T08:20:00Z",
    },
    isSubscribed: true,
    color: "orange",
  },
  {
    id: "fitness",
    name: "Fitness & Exercise",
    description: "Exercise routines and fitness tips",
    icon: "dumbbell",
    postCount: 156,
    lastPost: {
      id: "4",
      title: "Home workout routines for beginners",
      author: "Dr. James Wilson",
      createdAt: "2024-01-12T14:10:00Z",
    },
    isSubscribed: false,
    color: "purple",
  },
  {
    id: "chronic-conditions",
    name: "Chronic Conditions",
    description: "Support for managing chronic health conditions",
    icon: "heart",
    postCount: 94,
    lastPost: {
      id: "5",
      title: "Living with diabetes: daily management tips",
      author: "Dr. Emily Davis",
      createdAt: "2024-01-11T11:30:00Z",
    },
    isSubscribed: true,
    color: "red",
  },
  {
    id: "womens-health",
    name: "Women's Health",
    description: "Health topics specific to women",
    icon: "heart",
    postCount: 128,
    lastPost: {
      id: "6",
      title: "Prenatal care essentials",
      author: "Dr. Amanda Taylor",
      createdAt: "2024-01-10T16:45:00Z",
    },
    isSubscribed: false,
    color: "pink",
  },
]

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "Tips for staying healthy during winter months",
    content: `
      <p>Winter can be challenging for maintaining good health. Here are some evidence-based strategies to help you stay healthy during the colder months:</p>
      
      <h3>Immune System Support:</h3>
      <ul>
        <li>Get adequate sleep (7-9 hours per night)</li>
        <li>Eat a balanced diet rich in fruits and vegetables</li>
        <li>Stay hydrated even when it's cold</li>
        <li>Consider vitamin D supplementation</li>
        <li>Wash hands frequently and properly</li>
      </ul>
      
      <h3>Mental Health During Winter:</h3>
      <ul>
        <li>Maintain social connections</li>
        <li>Get sunlight exposure when possible</li>
        <li>Stay physically active</li>
        <li>Practice stress management techniques</li>
        <li>Consider light therapy if experiencing SAD</li>
      </ul>
      
      <h3>Physical Activity:</h3>
      <p>Don't let cold weather stop you from exercising. Indoor alternatives include:</p>
      <ul>
        <li>Home workout videos</li>
        <li>Mall walking</li>
        <li>Gym membership</li>
        <li>Yoga or stretching routines</li>
        <li>Dancing</li>
      </ul>
      
      <p>What strategies do you use to stay healthy during winter? Share your tips below!</p>
    `,
    excerpt:
      "Evidence-based strategies for maintaining physical and mental health during the challenging winter months.",
    author: {
      id: "dr-johnson",
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      role: "Family Medicine Physician",
      joinDate: "2023-03-15",
    },
    category: {
      id: "general",
      name: "General Health",
      color: "blue",
    },
    tags: ["winter health", "immune system", "mental health", "exercise"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    likes: 45,
    bookmarks: 23,
    views: 234,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    isPinned: true,
    isLocked: false,
    status: "active",
  },
  {
    id: "2",
    title: "Managing anxiety in daily life: Practical strategies that work",
    content: `
      <p>Anxiety affects millions of people worldwide, but there are practical strategies that can help manage symptoms and improve quality of life.</p>
      
      <h3>Understanding Anxiety:</h3>
      <p>Anxiety is a normal response to stress, but when it becomes overwhelming or persistent, it can interfere with daily activities. Common symptoms include:</p>
      <ul>
        <li>Excessive worry or fear</li>
        <li>Restlessness or feeling on edge</li>
        <li>Difficulty concentrating</li>
        <li>Physical symptoms like rapid heartbeat</li>
        <li>Sleep disturbances</li>
      </ul>
      
      <h3>Practical Coping Strategies:</h3>
      <ul>
        <li><strong>Deep breathing exercises:</strong> Practice 4-7-8 breathing technique</li>
        <li><strong>Progressive muscle relaxation:</strong> Tense and release muscle groups</li>
        <li><strong>Mindfulness meditation:</strong> Focus on present moment awareness</li>
        <li><strong>Regular exercise:</strong> Physical activity releases endorphins</li>
        <li><strong>Limit caffeine:</strong> Reduce stimulants that can increase anxiety</li>
        <li><strong>Maintain routine:</strong> Structure can provide comfort and predictability</li>
      </ul>
      
      <h3>When to Seek Professional Help:</h3>
      <p>Consider consulting a mental health professional if:</p>
      <ul>
        <li>Anxiety interferes with daily activities</li>
        <li>You avoid situations due to anxiety</li>
        <li>Physical symptoms are severe</li>
        <li>You have thoughts of self-harm</li>
        <li>Coping strategies aren't effective</li>
      </ul>
      
      <p>Remember, seeking help is a sign of strength, not weakness. What anxiety management techniques have worked for you?</p>
    `,
    excerpt: "Practical, evidence-based strategies for managing anxiety symptoms and improving daily functioning.",
    author: {
      id: "dr-chen",
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      role: "Clinical Psychologist",
      joinDate: "2023-01-20",
    },
    category: {
      id: "mental-health",
      name: "Mental Health",
      color: "green",
    },
    tags: ["anxiety", "mental health", "coping strategies", "mindfulness"],
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
    likes: 78,
    bookmarks: 56,
    views: 456,
    comments: 24,
    isLiked: true,
    isBookmarked: true,
    isPinned: false,
    isLocked: false,
    status: "active",
  },
  {
    id: "3",
    title: "Meal planning for diabetes management: A practical guide",
    content: `
      <p>Effective meal planning is crucial for managing diabetes and maintaining stable blood sugar levels. Here's a comprehensive guide to help you create a sustainable meal planning routine.</p>
      
      <h3>Understanding Carbohydrate Counting:</h3>
      <p>Carbohydrates have the most significant impact on blood sugar levels. Key principles include:</p>
      <ul>
        <li>Learn to identify carbohydrate sources</li>
        <li>Use measuring tools and food scales</li>
        <li>Read nutrition labels carefully</li>
        <li>Keep a food diary to track patterns</li>
        <li>Work with a registered dietitian for personalized goals</li>
      </ul>
      
      <h3>Meal Planning Strategies:</h3>
      <ul>
        <li><strong>Consistent timing:</strong> Eat meals at regular intervals</li>
        <li><strong>Balanced plates:</strong> Include protein, vegetables, and controlled carbs</li>
        <li><strong>Portion control:</strong> Use measuring tools and visual cues</li>
        <li><strong>Prep ahead:</strong> Batch cook proteins and vegetables</li>
        <li><strong>Smart snacking:</strong> Choose protein and fiber-rich options</li>
      </ul>
      
      <h3>Sample Daily Meal Plan:</h3>
      <p><strong>Breakfast:</strong> Greek yogurt with berries and nuts</p>
      <p><strong>Lunch:</strong> Grilled chicken salad with olive oil dressing</p>
      <p><strong>Dinner:</strong> Baked salmon with roasted vegetables and quinoa</p>
      <p><strong>Snacks:</strong> Apple with peanut butter, or vegetables with hummus</p>
      
      <h3>Foods to Emphasize:</h3>
      <ul>
        <li>Non-starchy vegetables</li>
        <li>Lean proteins</li>
        <li>Whole grains in moderation</li>
        <li>Healthy fats (nuts, avocado, olive oil)</li>
        <li>Low-fat dairy products</li>
      </ul>
      
      <p>What meal planning strategies have worked best for your diabetes management?</p>
    `,
    excerpt:
      "Comprehensive guide to meal planning for diabetes management, including carbohydrate counting and practical strategies.",
    author: {
      id: "dr-brown",
      name: "Dr. Lisa Brown",
      avatar: "/placeholder.svg?height=40&width=40&text=LB",
      role: "Registered Dietitian",
      joinDate: "2023-05-10",
    },
    category: {
      id: "nutrition",
      name: "Nutrition & Diet",
      color: "orange",
    },
    tags: ["diabetes", "meal planning", "nutrition", "carbohydrates", "blood sugar"],
    createdAt: "2024-01-13T08:20:00Z",
    updatedAt: "2024-01-13T08:20:00Z",
    likes: 92,
    bookmarks: 67,
    views: 523,
    comments: 18,
    isLiked: false,
    isBookmarked: true,
    isPinned: false,
    isLocked: false,
    status: "active",
  },
  {
    id: "4",
    title: "Home workout routines for beginners: No equipment needed",
    content: `
      <p>Starting a fitness routine doesn't require a gym membership or expensive equipment. Here are effective home workout routines perfect for beginners.</p>
      
      <h3>Benefits of Home Workouts:</h3>
      <ul>
        <li>Convenience and flexibility</li>
        <li>Cost-effective</li>
        <li>Privacy and comfort</li>
        <li>No commute time</li>
        <li>Weather-independent</li>
      </ul>
      
      <h3>Basic Equipment (Optional):</h3>
      <ul>
        <li>Yoga mat for comfort</li>
        <li>Water bottle for hydration</li>
        <li>Towel for sweat</li>
        <li>Resistance bands (affordable option)</li>
        <li>Light dumbbells or water bottles</li>
      </ul>
      
      <h3>20-Minute Beginner Routine:</h3>
      <p><strong>Warm-up (5 minutes):</strong></p>
      <ul>
        <li>Marching in place - 1 minute</li>
        <li>Arm circles - 30 seconds each direction</li>
        <li>Leg swings - 30 seconds each leg</li>
        <li>Gentle stretching - 2 minutes</li>
      </ul>
      
      <p><strong>Main workout (12 minutes):</strong></p>
      <ul>
        <li>Bodyweight squats - 3 sets of 8-12 reps</li>
        <li>Push-ups (modified if needed) - 3 sets of 5-10 reps</li>
        <li>Plank hold - 3 sets of 15-30 seconds</li>
        <li>Lunges - 3 sets of 8 per leg</li>
      </ul>
      
      <p><strong>Cool-down (3 minutes):</strong></p>
      <ul>
        <li>Gentle stretching</li>
        <li>Deep breathing</li>
        <li>Hydration</li>
      </ul>
      
      <h3>Safety Tips:</h3>
      <ul>
        <li>Start slowly and progress gradually</li>
        <li>Listen to your body</li>
        <li>Maintain proper form</li>
        <li>Stay hydrated</li>
        <li>Consult a doctor before starting any new exercise program</li>
      </ul>
      
      <p>What's your favorite home workout routine? Share your experiences and tips!</p>
    `,
    excerpt:
      "Complete guide to effective home workout routines for beginners, requiring no equipment and minimal space.",
    author: {
      id: "dr-wilson",
      name: "Dr. James Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
      role: "Exercise Physiologist",
      joinDate: "2023-07-22",
    },
    category: {
      id: "fitness",
      name: "Fitness & Exercise",
      color: "purple",
    },
    tags: ["home workout", "beginners", "exercise", "fitness", "no equipment"],
    createdAt: "2024-01-12T14:10:00Z",
    updatedAt: "2024-01-12T14:10:00Z",
    likes: 134,
    bookmarks: 89,
    views: 678,
    comments: 31,
    isLiked: true,
    isBookmarked: false,
    isPinned: false,
    isLocked: false,
    status: "active",
  },
]

const mockComments: ForumComment[] = [
  {
    id: "c1",
    content:
      "Great tips! I especially appreciate the emphasis on vitamin D supplementation during winter. Many people don't realize how important this is.",
    author: {
      id: "user1",
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32&text=MR",
      role: "Patient",
    },
    postId: "1",
    createdAt: "2024-01-15T11:45:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
    likes: 8,
    isLiked: false,
    replies: [
      {
        id: "c1-r1",
        content:
          "I started taking vitamin D supplements last winter and noticed a significant improvement in my energy levels.",
        author: {
          id: "user2",
          name: "David Kim",
          avatar: "/placeholder.svg?height=32&width=32&text=DK",
          role: "Patient",
        },
        postId: "1",
        parentId: "c1",
        createdAt: "2024-01-15T12:30:00Z",
        updatedAt: "2024-01-15T12:30:00Z",
        likes: 3,
        isLiked: true,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    content:
      "The breathing exercises really work! I've been practicing the 4-7-8 technique for a few weeks now and it's helped me manage my anxiety much better.",
    author: {
      id: "user3",
      name: "Sarah Thompson",
      avatar: "/placeholder.svg?height=32&width=32&text=ST",
      role: "Patient",
    },
    postId: "2",
    createdAt: "2024-01-14T16:20:00Z",
    updatedAt: "2024-01-14T16:20:00Z",
    likes: 12,
    isLiked: true,
    replies: [],
  },
]

export async function getForumCategories(): Promise<ForumCategory[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockCategories
}

export async function getForumPosts(filters?: ForumFilters): Promise<ForumPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredPosts = [...mockPosts]

  if (filters?.category) {
    filteredPosts = filteredPosts.filter((post) => post.category.id === filters.category)
  }

  if (filters?.subscribedOnly) {
    const subscribedCategoryIds = mockCategories.filter((cat) => cat.isSubscribed).map((cat) => cat.id)
    filteredPosts = filteredPosts.filter((post) => subscribedCategoryIds.includes(post.category.id))
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "latest":
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "popular":
        filteredPosts.sort((a, b) => b.views - a.views)
        break
      case "mostLiked":
        filteredPosts.sort((a, b) => b.likes - a.likes)
        break
      case "mostCommented":
        filteredPosts.sort((a, b) => b.comments - a.comments)
        break
    }
  }

  return filteredPosts
}

export async function getForumPostById(id: string): Promise<ForumPost | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockPosts.find((post) => post.id === id) || null
}

export async function getForumComments(postId: string): Promise<ForumComment[]> {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return mockComments.filter((comment) => comment.postId === postId)
}

export async function toggleCategorySubscription(
  categoryId: string,
): Promise<{ success: boolean; isSubscribed: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const category = mockCategories.find((cat) => cat.id === categoryId)
  if (category) {
    category.isSubscribed = !category.isSubscribed
    return { success: true, isSubscribed: category.isSubscribed }
  }
  return { success: false, isSubscribed: false }
}

export async function togglePostLike(postId: string): Promise<{ success: boolean; likes: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const post = mockPosts.find((p) => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
    return { success: true, likes: post.likes }
  }
  return { success: false, likes: 0 }
}

export async function togglePostBookmark(postId: string): Promise<{ success: boolean; bookmarks: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const post = mockPosts.find((p) => p.id === postId)
  if (post) {
    post.isBookmarked = !post.isBookmarked
    post.bookmarks += post.isBookmarked ? 1 : -1
    return { success: true, bookmarks: post.bookmarks }
  }
  return { success: false, bookmarks: 0 }
}

export async function toggleCommentLike(commentId: string): Promise<{ success: boolean; likes: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const comment = mockComments.find((c) => c.id === commentId)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likes += comment.isLiked ? 1 : -1
    return { success: true, likes: comment.likes }
  }
  return { success: false, likes: 0 }
}

export async function addComment(
  postId: string,
  content: string,
  parentId?: string,
): Promise<{ success: boolean; comment?: ForumComment }> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const newComment: ForumComment = {
    id: `c${Date.now()}`,
    content,
    author: {
      id: "current-user",
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
      role: "Patient",
    },
    postId,
    parentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
    replies: [],
  }

  if (parentId) {
    const parentComment = mockComments.find((c) => c.id === parentId)
    if (parentComment) {
      parentComment.replies.push(newComment)
    }
  } else {
    mockComments.push(newComment)
  }

  // Update post comment count
  const post = mockPosts.find((p) => p.id === postId)
  if (post) {
    post.comments += 1
  }

  return { success: true, comment: newComment }
}
