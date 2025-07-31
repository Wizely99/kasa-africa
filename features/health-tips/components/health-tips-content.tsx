"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, Bookmark, BookmarkCheck, Eye, Clock, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getHealthTips,
  getHealthTipCategories,
  toggleHealthTipLike,
  toggleHealthTipBookmark,
} from "@/features/health-tips/actions/health-tip-actions"
import type { HealthTip, HealthTipCategory } from "@/features/health-tips/types/health-tip"

export function HealthTipsContent() {
  const [tips, setTips] = useState<HealthTip[]>([])
  const [categories, setCategories] = useState<HealthTipCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all") // Updated default value
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "mostLiked" | "mostBookmarked">("latest")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      filterTips()
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, selectedCategory, sortBy])

  const loadData = async () => {
    try {
      const [tipsData, categoriesData] = await Promise.all([getHealthTips(), getHealthTipCategories()])
      setTips(tipsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading health tips:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTips = async () => {
    setLoading(true)
    try {
      const filteredTips = await getHealthTips({
        search: searchQuery,
        category: selectedCategory,
        sortBy,
      })
      setTips(filteredTips)
    } catch (error) {
      console.error("Error filtering tips:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (tipId: string) => {
    try {
      const result = await toggleHealthTipLike(tipId)
      if (result.success) {
        setTips(tips.map((tip) => (tip.id === tipId ? { ...tip, isLiked: !tip.isLiked, likes: result.likes } : tip)))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleBookmark = async (tipId: string) => {
    try {
      const result = await toggleHealthTipBookmark(tipId)
      if (result.success) {
        setTips(
          tips.map((tip) =>
            tip.id === tipId ? { ...tip, isBookmarked: !tip.isBookmarked, bookmarks: result.bookmarks } : tip,
          ),
        )
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search health tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem> {/* Updated value prop */}
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="mostLiked">Most Liked</SelectItem>
            <SelectItem value="mostBookmarked">Most Bookmarked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              selectedCategory === category.id && "ring-2 ring-primary"
            )}
            onClick={() =>
              setSelectedCategory(selectedCategory === category.id ? "all" : category.id)
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Badge variant="secondary">{category.count}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Tips Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <Card key={tip.id} className="flex flex-col hover:shadow-lg transition-shadow">
            {tip.imageUrl && (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img src={tip.imageUrl || "/placeholder.svg"} alt={tip.title} className="w-full h-full object-cover" />
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="mb-2">
                  {tip.category}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(tip.id)}
                    className={cn("h-8 w-8 p-0", tip.isLiked && "text-red-500 hover:text-red-600")}
                  >
                    <Heart className={cn("h-4 w-4", tip.isLiked && "fill-current")} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleBookmark(tip.id)} className="h-8 w-8 p-0">
                    {tip.isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold leading-tight">{tip.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{tip.excerpt}</p>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={tip.author.avatar || "/placeholder.svg"} alt={tip.author.name} />
                  <AvatarFallback className="text-xs">
                    {tip.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{tip.author.name}</p>
                  <p className="text-xs text-muted-foreground">{tip.author.credentials}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {tip.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{tip.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    <span>{tip.bookmarks}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{tip.views}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{tip.readingTime} min read</span>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">{formatDate(tip.publishedAt)}</span>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {tips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No health tips found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
