import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/api"
import { LogoutButton } from "./logout-button"
import { SidebarTrigger } from "./ui/sidebar"

export default async function Header({ layout }: { layout: "root" | "auth" }) {
  const user = await getUser()

  return (
    <header className="w-full border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {layout === "root" && <SidebarTrigger size={"lg"} />}
          <Link href="/" className="text-xl font-bold">
            NoirNote.
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>

              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
