import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AiReviewerShimmer() {
  return (
    <Card className="mx-auto w-full max-w-3xl rounded-2xl border bg-background/60 backdrop-blur">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-10 w-full rounded-md" />

        <Skeleton className="h-40 w-full rounded-xl" />

        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
