import { createClient } from "./supabase/server"

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error(error.message)
    return null
  }

  return user
}
