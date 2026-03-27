import { AiReviewer } from "@/components/ai-reviewer"
import prisma from "@/lib/prisma"

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

  return <AiReviewer note={note} />
}
