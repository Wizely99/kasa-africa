import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ForumPostContent } from "../components/forum-post-content"

export interface ForumPostPageProps {
  params: {
    id: string
  }
}

export default function ForumPost({ params }: ForumPostPageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ForumPostPageSkeleton />}>
        <ForumPostContent postId={params.id} />
      </Suspense>
    </div>
  )
}

function ForumPostPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
