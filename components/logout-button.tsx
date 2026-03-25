"use client"

import { logoutAction } from "@/lib/actions"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export const LogoutButton = () => {
  const router = useRouter()

  const handleoLogout = async () => {
    await logoutAction()
    router.replace("/auth/login")
  }

  return <Button onClick={handleoLogout}>Logout</Button>
}
