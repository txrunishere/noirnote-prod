"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircle } from "@hugeicons/core-free-icons"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex justify-center px-4 py-20">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <HugeiconsIcon
              icon={AlertCircle}
              className="h-10 w-10 text-destructive"
            />
          </div>

          <h2 className="text-xl font-semibold">Something went wrong!</h2>

          <p className="text-sm text-muted-foreground">
            {error.message || "Unexpected error occurred"}
          </p>

          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}

          <Button onClick={reset} className="mt-2 w-full">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
