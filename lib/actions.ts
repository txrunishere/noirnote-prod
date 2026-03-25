"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import prisma from "./prisma"

export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error || !data.user) {
    console.error("Register error:", error?.message)
    throw new Error(error?.message)
  }

  const user = data.user

  try {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
      },
    })
  } catch (err) {
    console.error("Prisma error:", err)
    throw new Error("Unable to create user!")
  }

  redirect("/")
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error.message)
    throw new Error(error.message)
  }

  redirect("/")
}

export async function logoutAction() {
  const { auth } = await createClient()

  const { error } = await auth.signOut()

  if (error) {
    console.error(error.message)
    throw new Error(error.message)
  }
}
