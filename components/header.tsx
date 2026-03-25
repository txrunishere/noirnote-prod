import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/api"
import { LogoutButton } from "./logout-button"

export default async function Header() {
  const user = await getUser()

  return (
    <header className="w-full border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          NoirNote.
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>

              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
