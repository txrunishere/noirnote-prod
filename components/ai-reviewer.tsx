"use client"

import { useState, useTransition, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, RefreshCw, Loader2 } from "lucide-react"
import { Note } from "@/generated/prisma/browser"
import { toast } from "sonner"
import {
  rewriteNoteAction,
  summarizeNoteAction,
  askOnSummaryAction,
  type ActionResult,
  updateNoteContentAction,
} from "@/lib/actions"

type Mode = "none" | "rewrite" | "summary"

export const AiReviewer = ({ note }: { note: Note }) => {
  const [content, setContent] = useState(note.content)
  const originalContent = useRef(note.content)

  const [aiContent, setAiContent] = useState("")
  const [summary, setSummary] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const [mode, setMode] = useState<Mode>("none")
  const [pendingMode, setPendingMode] = useState<Mode>("none")
  const [isPending, startTransition] = useTransition()

  const handleRewrite = () => {
    setPendingMode("rewrite")
    setMode("rewrite")

    const toastId = toast.loading("Rewriting your note…")

    startTransition(async () => {
      const res: ActionResult = await rewriteNoteAction(content)
      setPendingMode("none")

      if (res.success) {
        setAiContent(res.data)
        toast.success("Note rewritten — review it below.", { id: toastId })
      } else {
        setMode("none")
        toast.error(res.message, { id: toastId })
      }
    })
  }

  const handleSummarize = () => {
    setAnswer("")
    setPendingMode("summary")
    setMode("summary")

    const toastId = toast.loading("Summarizing your note…")

    startTransition(async () => {
      const res: ActionResult = await summarizeNoteAction(content)
      setPendingMode("none")

      if (res.success) {
        setSummary(res.data)
        toast.success("Summary ready.", { id: toastId })
      } else {
        setMode("none")
        toast.error(res.message, { id: toastId })
      }
    })
  }

  const handleCancelRewrite = () => {
    setContent(originalContent.current)
    setAiContent("")
    setMode("none")
    toast.info("Rewrite discarded.")
  }

  const handleConfirmRewrite = () => {
    const toastId = toast.loading("Saving changes…")

    startTransition(async () => {
      const res = await updateNoteContentAction(note.id, aiContent)

      if (res.success) {
        setContent(aiContent)
        originalContent.current = aiContent
        setAiContent("")
        setMode("none")
        toast.success("Changes saved.", { id: toastId })
      } else {
        toast.error(res.message, { id: toastId })
      }
    })
  }

  const handleAsk = () => {
    setAnswer("")

    const toastId = toast.loading("Thinking…")

    startTransition(async () => {
      const res: ActionResult = await askOnSummaryAction(summary, question)

      if (res.success) {
        setAnswer(res.data)
        toast.success("Answer ready.", { id: toastId })
      } else {
        toast.error(res.message, { id: toastId })
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isPending && question.trim().length >= 3) {
      handleAsk()
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <Card className="rounded-3xl border bg-linear-to-br from-background to-muted/40 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            AI Note Assistant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enhance, summarize and interact with your notes
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <Input value={note.title} readOnly className="font-medium" />

          <Textarea
            value={content}
            readOnly
            className="min-h-45 resize-none rounded-xl border-muted bg-muted/30"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleRewrite}
              disabled={isPending}
              className="flex-1"
            >
              {isPending && pendingMode === "rewrite" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Rewrite
            </Button>

            <Button
              variant="secondary"
              onClick={handleSummarize}
              disabled={isPending}
              className="flex-1"
            >
              {isPending && pendingMode === "summary" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Summarize
            </Button>
          </div>
        </CardContent>
      </Card>

      {mode === "rewrite" && aiContent && (
        <Card className="rounded-2xl border-dashed bg-muted/30 shadow-md">
          <CardHeader>
            <CardTitle>AI Improved Version</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea value={aiContent} readOnly className="min-h-40" />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancelRewrite}>
                Discard
              </Button>
              <Button onClick={handleConfirmRewrite} disabled={isPending}>
                Accept Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "summary" && summary && (
        <Card className="rounded-2xl bg-muted/20 shadow-md">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl bg-background p-4 text-sm text-muted-foreground shadow-sm">
              {summary}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask a question about this note…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
              />
              <Button
                onClick={handleAsk}
                disabled={isPending || question.trim().length < 3}
              >
                {isPending && pendingMode === "none" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ask"
                )}
              </Button>
            </div>

            {answer && (
              <div className="rounded-xl border bg-background p-4 shadow-sm">
                <p className="text-sm">{answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
