import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostCardSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Header Skeleton */}
        <div className="flex items-start gap-3 p-6 pb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-8" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        {/* Content Skeleton */}
        <div className="px-6 pb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Goal Progress Skeleton */}
        <div className="mx-6 mb-4 bg-muted/30 rounded-lg p-4 border border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="px-6 py-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-12 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
