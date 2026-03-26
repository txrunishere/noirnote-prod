"use client"

import { Note } from "@/generated/prisma/browser"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { MoreVerticalIcon } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Trash } from "@hugeicons/core-free-icons"
import { deleteNoteAction, updateNotePinAction } from "@/lib/actions"
import { toast } from "sonner"

export const SidebarNoteItem = ({ note }: { note: Note }) => {
  const handleUpdatePinNote = async () => {
    const res = await updateNotePinAction(note.id, note.isPinned)

    if (!res.success) {
      toast.error(res.message)
      return
    }
  }

  const handleDeleteNote = async () => {
    const res = await deleteNoteAction(note.id)

    if (!res.success) {
      toast.error(res.message)
      return
    }

    toast.info("Note deleted successfully!")
  }

  return (
    <Card className="gap-2 p-2">
      <CardHeader className="flex justify-between px-2">
        <Link href={`/note/${note.id}`}>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {note.content}
          </CardDescription>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon-sm"} variant={"outline"}>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleUpdatePinNote}>
                {note.isPinned ? "Unpin Note" : "Pin Note"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteNote}
                className="hover:bg-red-600/30!"
              >
                <HugeiconsIcon icon={Trash} />
                Delete Note
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  )
}
