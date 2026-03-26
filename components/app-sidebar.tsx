import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Search } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { getUser } from "@/lib/api"
import prisma from "@/lib/prisma"
import { SidebarNoteItem } from "./sidebar-note-item"

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
      <SidebarHeader className="pt-6">
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
            <div className="space-y-2">
              {pinnedNotes.map((note) => (
                <SidebarNoteItem key={note.id} note={note} />
              ))}
            </div>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>All Notes</SidebarGroupLabel>
          <div className="space-y-2">
            {otherNotes.map((note) => (
              <SidebarNoteItem key={note.id} note={note} />
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
