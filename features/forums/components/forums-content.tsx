"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  getForumCategories,
  getForumPosts,
  toggleCategorySubscription,
  togglePostBookmark,
  togglePostLike,
} from "@/features/forums/actions/forum-actions";
import type { ForumCategory, ForumPost } from "@/features/forums/types/forum";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellRing,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Eye,
  Filter,
  Heart,
  Lock,
  MessageSquare,
  Pin,
  Search,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ForumsContent() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Updated default value
  const [sortBy, setSortBy] = useState<
    "latest" | "popular" | "mostLiked" | "mostCommented"
  >("latest");
  const [subscribedOnly, setSubscribedOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      filterPosts();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory, sortBy, subscribedOnly]);

  const loadData = async () => {
    try {
      const [categoriesData, postsData] = await Promise.all([
        getForumCategories(),
        getForumPosts(),
      ]);
      setCategories(categoriesData);
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading forum data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = async () => {
    setLoading(true);
    try {
      const filteredPosts = await getForumPosts({
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        subscribedOnly,
      });
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Error filtering posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (categoryId: string) => {
    try {
      const result = await toggleCategorySubscription(categoryId);
      if (result.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, isSubscribed: result.isSubscribed }
              : cat
          )
        );
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const result = await togglePostLike(postId);
      if (result.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, isLiked: !post.isLiked, likes: result.likes }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      const result = await togglePostBookmark(postId);
      if (result.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isBookmarked: !post.isBookmarked,
                  bookmarks: result.bookmarks,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-100 text-green-700 border-green-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      red: "bg-red-100 text-red-700 border-red-200",
      pink: "bg-pink-100 text-pink-700 border-pink-200",
    };
    return (
      colors[color as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
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
            <SelectItem value="all">All Categories</SelectItem>{" "}
            {/* Updated value prop */}
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
            <SelectItem value="mostCommented">Most Commented</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch
            id="subscribed-only"
            checked={subscribedOnly}
            onCheckedChange={setSubscribedOnly}
          />
          <Label htmlFor="subscribed-only" className="text-sm font-medium">
            Subscribed Only
          </Label>
        </div>
      </div>
      {/* Categories Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedCategory === category.id && "ring-2 ring-primary"
            )}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.id ? "all" : category.id
              )
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-3  rounded-full",
                      getCategoryColor(category.color)
                    )}
                  />
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(category.id);
                  }}
                  className="h-8 w-8 p-0"
                >
                  {category.isSubscribed ? (
                    <BellRing className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{category.postCount} posts</span>
                  </div>
                </div>
                {category.lastPost && (
                  <div className="text-xs text-muted-foreground">
                    {formatDate(category.lastPost.createdAt)}
                  </div>
                )}
              </div>
              {category.lastPost && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <p className="font-medium truncate">
                    {category.lastPost.title}
                  </p>
                  <p className="text-muted-foreground">
                    by {category.lastPost.author}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Forum Posts */};
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Discussions</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{posts.length} posts</span>
          </div>
        </div>

        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {post.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                    {post.isLocked && (
                      <Lock className="h-4 w-4 text-gray-500" />
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        getCategoryColor(post.category.color)
                      )}
                    >
                      {post.category.name}
                    </Badge>
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <Link
                      href={`/patient/forums/posts/${post.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-semibold text-lg leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                        />
                        <AvatarFallback className="text-xs">
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {post.author.role}
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "h-8 w-8 p-0",
                        post.isLiked && "text-red-500 hover:text-red-600"
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          post.isLiked && "fill-current"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(post.id)}
                      className="h-8 w-8 p-0"
                    >
                      {post.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {posts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No discussions found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
