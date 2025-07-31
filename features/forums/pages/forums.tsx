import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ForumsContent } from "../components/forums-content"

export default function Forums() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Forums</h1>
        <p className="text-muted-foreground">
          Connect with others, share experiences, and get support from the community
        </p>
      </div>

      <Suspense fallback={<ForumsPageSkeleton />}>
        <ForumsContent />
      </Suspense>
    </div>
  )
}

function ForumsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
