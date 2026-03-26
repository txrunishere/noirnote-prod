"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function CreateNoteForm() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-4xl font-bold tracking-tight">
          <Sparkles className="h-6 w-6 text-primary" />
          Create a Note
        </h1>
        <p className="mt-1 text-muted-foreground">
          Capture your thoughts and let AI refine, organize, and enhance them.
        </p>
      </div>

      <Card className="border border-border/60 bg-background/80 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Start with a rough idea, AI will help you improve clarity,
            structure, and quality.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Title</Label>
              <Input placeholder="e.g. Meeting notes, Ideas..." required />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Content</Label>
              <Textarea
                placeholder="Start writing your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
                required
              />
              <p className="text-right text-xs text-muted-foreground">
                {content.length} characters
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving Note..." : "Save Note"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
