import { AiReviewer } from "@/components/ai-reviewer"
import { AiReviewerShimmer } from "@/components/ai-reviewer-shimmer"
import prisma from "@/lib/prisma"
import { Suspense } from "react"

export default async function AiNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>
}) {
  const { noteId } = await params

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  })

  if (!note) {
    return (
      <p className="mt-10 w-full text-center text-xl font-semibold">
        Note not found!
      </p>
    )
  }

  return (
    <Suspense fallback={<AiReviewerShimmer />}>
      <AiReviewer note={note} />
    </Suspense>
  )
}
