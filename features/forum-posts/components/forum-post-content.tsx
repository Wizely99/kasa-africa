"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Bookmark,
  BookmarkCheck,
  Eye,
  MessageSquare,
  Reply,
  ArrowLeft,
  Pin,
  Lock,
  Calendar,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getForumPostById,
  getForumComments,
  togglePostLike,
  togglePostBookmark,
  toggleCommentLike,
  addComment,
} from "@/features/forums/actions/forum-actions"
import type { ForumPost, ForumComment } from "@/features/forums/types/forum"

interface ForumPostContentProps {
  postId: string
}

export function ForumPostContent({ postId }: ForumPostContentProps) {
  const [post, setPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    loadData()
  }, [postId])

  const loadData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([getForumPostById(postId), getForumComments(postId)])
      setPost(postData)
      setComments(commentsData)
    } catch (error) {
      console.error("Error loading post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!post) return
    try {
      const result = await togglePostLike(post.id)
      if (result.success) {
        setPost({ ...post, isLiked: !post.isLiked, likes: result.likes })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleBookmark = async () => {
    if (!post) return
    try {
      const result = await togglePostBookmark(post.id)
      if (result.success) {
        setPost({ ...post, isBookmarked: !post.isBookmarked, bookmarks: result.bookmarks })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    try {
      const result = await toggleCommentLike(commentId)
      if (result.success) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, isLiked: !comment.isLiked, likes: result.likes }
              : {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === commentId ? { ...reply, isLiked: !reply.isLiked, likes: result.likes } : reply,
                  ),
                },
          ),
        )
      }
    } catch (error) {
      console.error("Error toggling comment like:", error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return
    try {
      const result = await addComment(post.id, newComment)
      if (result.success && result.comment) {
        setComments([...comments, result.comment])
        setNewComment("")
        setPost({ ...post, comments: post.comments + 1 })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !post) return
    try {
      const result = await addComment(post.id, replyContent, parentId)
      if (result.success && result.comment) {
        setComments(
          comments.map((comment) =>
            comment.id === parentId ? { ...comment, replies: [...comment.replies, result.comment!] } : comment,
          ),
        )
        setReplyContent("")
        setReplyingTo(null)
        setPost({ ...post, comments: post.comments + 1 })
      }
    } catch (error) {
      console.error("Error adding reply:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-100 text-green-700 border-green-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      red: "bg-red-100 text-red-700 border-red-200",
      pink: "bg-pink-100 text-pink-700 border-pink-200",
    }
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Post not found.</p>
        <Link href="/patient/forums">
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forums
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/patient/forums" className="hover:underline">
          Forums
        </Link>
        <span>/</span>
        <Link href={`/patient/forums?category=${post.category.id}`} className="hover:underline">
          {post.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{post.title}</span>
      </div>

      {/* Post Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            {post.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
            {post.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
            <Badge variant="outline" className={cn("text-xs", getCategoryColor(post.category.color))}>
              {post.category.name}
            </Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn("gap-2", post.isLiked && "text-red-500 hover:text-red-600")}
              >
                <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBookmark} className="gap-2">
                {post.isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-blue-500" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span>{post.bookmarks}</span>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} disabled={!newComment.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>
                    {comment.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-sm text-muted-foreground">{comment.author.role}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentLike(comment.id)}
                      className={cn("h-8 gap-1 text-xs", comment.isLiked && "text-red-500 hover:text-red-600")}
                    >
                      <Heart className={cn("h-3 w-3", comment.isLiked && "fill-current")} />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="h-8 gap-1 text-xs"
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="space-y-3 mt-3">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-16"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!replyContent.trim()}>
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-11 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                        <AvatarFallback>
                          {reply.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{reply.author.name}</span>
                          <span className="text-xs text-muted-foreground">{reply.author.role}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(reply.id)}
                          className={cn("h-7 gap-1 text-xs", reply.isLiked && "text-red-500 hover:text-red-600")}
                        >
                          <Heart className={cn("h-3 w-3", reply.isLiked && "fill-current")} />
                          <span>{reply.likes}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {comment !== comments[comments.length - 1] && <Separator />}
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
