import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Search, Trash } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { getUser } from "@/lib/api"
import prisma from "@/lib/prisma"
import { Note } from "@/generated/prisma/client"
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

export async function AppSidebar() {
  const user = await getUser()
  const notes = await prisma.note.findMany({
    where: {
      authorId: user?.id,
    },
  })

  const pinnedNotes = notes.filter((note) => note.isPinned)
  const otherNotes = notes.filter((note) => !note.isPinned)

  return (
    <Sidebar>
      <SidebarHeader className="pt-10">
        <h1 className="ml-4 text-xl font-semibold">Your Notes</h1>
      </SidebarHeader>
      <SidebarContent className="mx-2 mt-2">
        <SidebarGroup>
          <InputGroup>
            <InputGroupInput
              id="note-search"
              placeholder="Search your note..."
            />
            <InputGroupAddon>
              <HugeiconsIcon icon={Search} />
            </InputGroupAddon>
          </InputGroup>
        </SidebarGroup>
        <SidebarGroup />
        {pinnedNotes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Pinned Notes</SidebarGroupLabel>
            {pinnedNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>All Notes</SidebarGroupLabel>
          {otherNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function NoteItem({ note }: { note: Note }) {
  return (
    <Card className="gap-2 p-2">
      <CardHeader className="flex px-2">
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
              <DropdownMenuItem>
                {note.isPinned ? "Unpin Note" : "Pin Note"}
              </DropdownMenuItem>
              <DropdownMenuItem>Change Title</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-600/30!">
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
