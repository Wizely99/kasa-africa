import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { HealthTipsContent } from "../components/health-tips-content"

export default function PatientHealthTips() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Tips</h1>
        <p className="text-muted-foreground">Expert health advice and tips from medical professionals</p>
      </div>

      <Suspense fallback={<HealthTipsPageSkeleton />}>
        <HealthTipsContent />
      </Suspense>
    </div>
  )
}

function HealthTipsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
