"use server"

import type { HealthTip, HealthTipCategory, HealthTipFilters } from "../types/health-tip"

// Mock data
const mockHealthTips: HealthTip[] = [
  {
    id: "1",
    title: "Understanding Heart Health: Key Steps to a Stronger Heart",
    content: `
      <p>Cardiovascular health is one of the most important aspects of overall wellness. Your heart works tirelessly to pump blood throughout your body, delivering oxygen and nutrients to every cell.</p>
      
      <h3>Key Strategies for Heart Health:</h3>
      <ul>
        <li><strong>Regular Exercise:</strong> Aim for at least 150 minutes of moderate-intensity aerobic activity per week</li>
        <li><strong>Healthy Diet:</strong> Focus on fruits, vegetables, whole grains, and lean proteins</li>
        <li><strong>Manage Stress:</strong> Practice meditation, deep breathing, or yoga</li>
        <li><strong>Quality Sleep:</strong> Aim for 7-9 hours of quality sleep each night</li>
        <li><strong>Regular Check-ups:</strong> Monitor blood pressure, cholesterol, and other vital signs</li>
      </ul>
      
      <h3>Warning Signs to Watch For:</h3>
      <p>It's important to recognize potential warning signs of heart problems:</p>
      <ul>
        <li>Chest pain or discomfort</li>
        <li>Shortness of breath</li>
        <li>Irregular heartbeat</li>
        <li>Swelling in legs, ankles, or feet</li>
        <li>Persistent fatigue</li>
      </ul>
      
      <p>If you experience any of these symptoms, consult with your healthcare provider immediately.</p>
    `,
    excerpt:
      "Learn essential strategies for maintaining cardiovascular health and recognizing warning signs of heart problems.",
    author: {
      id: "dr-smith",
      name: "Dr. Sarah Smith",
      credentials: "MD, Cardiologist",
      avatar: "/placeholder.svg?height=40&width=40&text=SS",
      specialization: "Cardiology",
    },
    category: "Cardiology",
    tags: ["heart health", "exercise", "diet", "prevention"],
    publishedAt: "2024-01-15T10:00:00Z",
    readingTime: 8,
    likes: 145,
    bookmarks: 89,
    views: 2340,
    isLiked: false,
    isBookmarked: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Heart+Health",
    status: "published",
  },
  {
    id: "2",
    title: "Managing Diabetes: A Comprehensive Guide to Blood Sugar Control",
    content: `
      <p>Diabetes affects millions of people worldwide, but with proper management, individuals can live healthy, fulfilling lives. Understanding how to control blood sugar levels is crucial for preventing complications.</p>
      
      <h3>Types of Diabetes:</h3>
      <ul>
        <li><strong>Type 1 Diabetes:</strong> Autoimmune condition where the body doesn't produce insulin</li>
        <li><strong>Type 2 Diabetes:</strong> Body becomes resistant to insulin or doesn't produce enough</li>
        <li><strong>Gestational Diabetes:</strong> Develops during pregnancy</li>
      </ul>
      
      <h3>Blood Sugar Management:</h3>
      <ul>
        <li><strong>Monitor Regularly:</strong> Check blood glucose levels as recommended by your doctor</li>
        <li><strong>Medication Compliance:</strong> Take prescribed medications as directed</li>
        <li><strong>Carbohydrate Counting:</strong> Learn to count carbs to manage insulin doses</li>
        <li><strong>Regular Meals:</strong> Eat at consistent times to maintain stable blood sugar</li>
      </ul>
      
      <h3>Lifestyle Modifications:</h3>
      <ul>
        <li>Maintain a healthy weight</li>
        <li>Exercise regularly (with doctor approval)</li>
        <li>Quit smoking if applicable</li>
        <li>Limit alcohol consumption</li>
        <li>Manage stress effectively</li>
      </ul>
      
      <p>Working closely with your healthcare team is essential for optimal diabetes management.</p>
    `,
    excerpt:
      "Essential information about diabetes management, blood sugar control, and lifestyle modifications for better health.",
    author: {
      id: "dr-johnson",
      name: "Dr. Michael Johnson",
      credentials: "MD, Endocrinologist",
      avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      specialization: "Endocrinology",
    },
    category: "Endocrinology",
    tags: ["diabetes", "blood sugar", "insulin", "lifestyle"],
    publishedAt: "2024-01-10T14:30:00Z",
    readingTime: 12,
    likes: 203,
    bookmarks: 156,
    views: 3250,
    isLiked: true,
    isBookmarked: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Diabetes+Management",
    status: "published",
  },
  {
    id: "3",
    title: "Mental Health Awareness: Breaking the Stigma and Seeking Help",
    content: `
      <p>Mental health is just as important as physical health, yet it's often overlooked or stigmatized. Understanding mental health conditions and knowing when to seek help can make a significant difference in quality of life.</p>
      
      <h3>Common Mental Health Conditions:</h3>
      <ul>
        <li><strong>Depression:</strong> Persistent feelings of sadness, hopelessness, or emptiness</li>
        <li><strong>Anxiety:</strong> Excessive worry, fear, or nervousness</li>
        <li><strong>Bipolar Disorder:</strong> Extreme mood swings between highs and lows</li>
        <li><strong>PTSD:</strong> Trauma-related stress and anxiety</li>
      </ul>
      
      <h3>Warning Signs to Watch For:</h3>
      <ul>
        <li>Persistent sadness or anxiety</li>
        <li>Loss of interest in activities</li>
        <li>Changes in sleep patterns</li>
        <li>Difficulty concentrating</li>
        <li>Withdrawal from friends and family</li>
        <li>Thoughts of self-harm</li>
      </ul>
      
      <h3>Seeking Help:</h3>
      <ul>
        <li>Talk to your primary care doctor</li>
        <li>Consider therapy or counseling</li>
        <li>Join support groups</li>
        <li>Practice self-care activities</li>
        <li>Maintain social connections</li>
      </ul>
      
      <p>Remember: seeking help for mental health is a sign of strength, not weakness. There's no shame in asking for support.</p>
    `,
    excerpt:
      "Understanding mental health conditions, recognizing warning signs, and knowing how to seek appropriate help and support.",
    author: {
      id: "dr-williams",
      name: "Dr. Emily Williams",
      credentials: "PhD, Clinical Psychologist",
      avatar: "/placeholder.svg?height=40&width=40&text=EW",
      specialization: "Mental Health",
    },
    category: "Mental Health",
    tags: ["mental health", "depression", "anxiety", "therapy", "support"],
    publishedAt: "2024-01-08T09:15:00Z",
    readingTime: 10,
    likes: 178,
    bookmarks: 134,
    views: 2890,
    isLiked: false,
    isBookmarked: true,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Mental+Health",
    status: "published",
  },
  {
    id: "4",
    title: "Nutrition Essentials: Building a Balanced Diet for Optimal Health",
    content: `
      <p>Good nutrition is the foundation of good health. Understanding the basics of nutrition can help you make informed choices about what you eat and how it affects your body.</p>
      
      <h3>Essential Nutrients:</h3>
      <ul>
        <li><strong>Carbohydrates:</strong> Your body's primary energy source</li>
        <li><strong>Proteins:</strong> Building blocks for muscles, organs, and tissues</li>
        <li><strong>Fats:</strong> Essential for brain function and hormone production</li>
        <li><strong>Vitamins:</strong> Support various bodily functions</li>
        <li><strong>Minerals:</strong> Important for bone health and metabolism</li>
        <li><strong>Water:</strong> Essential for all bodily functions</li>
      </ul>
      
      <h3>Building a Balanced Plate:</h3>
      <ul>
        <li><strong>Half your plate:</strong> Fruits and vegetables</li>
        <li><strong>Quarter of your plate:</strong> Lean proteins</li>
        <li><strong>Quarter of your plate:</strong> Whole grains</li>
        <li><strong>Add:</strong> Healthy fats in moderation</li>
      </ul>
      
      <h3>Healthy Eating Tips:</h3>
      <ul>
        <li>Eat regular meals and healthy snacks</li>
        <li>Stay hydrated throughout the day</li>
        <li>Limit processed foods and added sugars</li>
        <li>Choose whole grains over refined grains</li>
        <li>Include a variety of colorful fruits and vegetables</li>
        <li>Practice portion control</li>
      </ul>
      
      <p>Remember: healthy eating is about balance, not restriction. Make gradual changes that you can maintain long-term.</p>
    `,
    excerpt:
      "Learn the fundamentals of nutrition and how to build a balanced diet that supports your overall health and wellness.",
    author: {
      id: "dr-brown",
      name: "Dr. Lisa Brown",
      credentials: "RD, Nutritionist",
      avatar: "/placeholder.svg?height=40&width=40&text=LB",
      specialization: "Nutrition",
    },
    category: "Nutrition",
    tags: ["nutrition", "diet", "healthy eating", "balanced diet", "wellness"],
    publishedAt: "2024-01-05T16:45:00Z",
    readingTime: 7,
    likes: 267,
    bookmarks: 198,
    views: 4120,
    isLiked: true,
    isBookmarked: true,
    imageUrl: "/placeholder.svg?height=200&width=400&text=Nutrition+Guide",
    status: "published",
  },
]

const mockCategories: HealthTipCategory[] = [
  { id: "cardiology", name: "Cardiology", description: "Heart and cardiovascular health", count: 15, icon: "heart" },
  {
    id: "endocrinology",
    name: "Endocrinology",
    description: "Diabetes and hormonal health",
    count: 12,
    icon: "activity",
  },
  {
    id: "mental-health",
    name: "Mental Health",
    description: "Mental wellness and psychological health",
    count: 18,
    icon: "brain",
  },
  { id: "nutrition", name: "Nutrition", description: "Diet and nutritional guidance", count: 22, icon: "apple" },
  { id: "general", name: "General Health", description: "General health and wellness tips", count: 35, icon: "shield" },
  { id: "fitness", name: "Fitness", description: "Exercise and physical activity", count: 14, icon: "dumbbell" },
]

export async function getHealthTips(filters?: HealthTipFilters): Promise<HealthTip[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredTips = [...mockHealthTips]

  if (filters?.category) {
    filteredTips = filteredTips.filter((tip) => tip.category.toLowerCase() === filters.category?.toLowerCase())
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredTips = filteredTips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(searchTerm) ||
        tip.content.toLowerCase().includes(searchTerm) ||
        tip.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "latest":
        filteredTips.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case "popular":
        filteredTips.sort((a, b) => b.views - a.views)
        break
      case "mostLiked":
        filteredTips.sort((a, b) => b.likes - a.likes)
        break
      case "mostBookmarked":
        filteredTips.sort((a, b) => b.bookmarks - a.bookmarks)
        break
    }
  }

  return filteredTips
}

export async function getHealthTipById(id: string): Promise<HealthTip | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockHealthTips.find((tip) => tip.id === id) || null
}

export async function getHealthTipCategories(): Promise<HealthTipCategory[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockCategories
}

export async function toggleHealthTipLike(id: string): Promise<{ success: boolean; likes: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const tip = mockHealthTips.find((t) => t.id === id)
  if (tip) {
    tip.isLiked = !tip.isLiked
    tip.likes += tip.isLiked ? 1 : -1
    return { success: true, likes: tip.likes }
  }
  return { success: false, likes: 0 }
}

export async function toggleHealthTipBookmark(id: string): Promise<{ success: boolean; bookmarks: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const tip = mockHealthTips.find((t) => t.id === id)
  if (tip) {
    tip.isBookmarked = !tip.isBookmarked
    tip.bookmarks += tip.isBookmarked ? 1 : -1
    return { success: true, bookmarks: tip.bookmarks }
  }
  return { success: false, bookmarks: 0 }
}
