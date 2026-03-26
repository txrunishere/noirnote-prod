"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import prisma from "./prisma"
import { getUser } from "./api"
import { revalidatePath } from "next/cache"

type ActionResponse = {
  success: boolean
  message?: string
}

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

export async function createNoteAction(
  title: string,
  content: string
): Promise<ActionResponse> {
  if (!title || !content) {
    return {
      success: false,
      message: "Title and content are required!",
    }
  }

  const user = await getUser()

  if (!user) {
    return {
      success: false,
      message: "User not found!",
    }
  }

  try {
    await prisma.note.create({
      data: {
        content,
        title,
        authorId: user.id,
      },
    })
  } catch (error) {
    console.error("Create Note Error:", error)

    return {
      success: false,
      message: "Something went wrong while creating note!",
    }
  }

  revalidatePath("/")
  return { success: true }
}

export async function updateNotePinAction(
  noteId: string,
  pinStatus: boolean
): Promise<ActionResponse> {
  try {
    if (pinStatus) {
      await prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          isPinned: false,
        },
      })
    } else {
      await prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          isPinned: true,
        },
      })
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while updating note!",
    }
  }
}

export async function deleteNoteAction(
  noteId: string
): Promise<ActionResponse> {
  try {
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    })

    revalidatePath("/")
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while deleting note!",
    }
  }
}
