"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import prisma from "./prisma"
import { getUser } from "./api"
import { revalidatePath } from "next/cache"
import { genAI } from "./ai"

type ActionResponse = {
  success: boolean
  message?: string
}

export type ActionResult =
  | { success: true; data: string }
  | { success: false; message: string }

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

export async function updateNoteContentAction(
  noteId: string,
  content: string
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        content,
      },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      message: "Something went wrong while updating note's content!",
      success: false,
    }
  }
}

function cleanText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^[>-]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function validateContent(
  content: string,
  minLength: number
): ActionResult | null {
  if (!content || content.trim().length < minLength) {
    return {
      success: false,
      message: `Content must be at least ${minLength} characters.`,
    }
  }
  return null
}

function handleError(error: unknown, label: string): ActionResult {
  console.error(`[${label}] error:`, error)
  return {
    success: false,
    message:
      error instanceof Error
        ? error.message
        : `${label} failed. Please try again.`,
  }
}

async function callGemini(prompt: string): Promise<string> {
  const result = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  })
  return cleanText(result.text || "")
}

export async function rewriteNoteAction(
  content: string
): Promise<ActionResult> {
  const invalid = validateContent(content, 10)
  if (invalid) return invalid

  try {
    const prompt = `
      You are a professional editor. Your job is to rewrite the note below so it is clear, concise, and grammatically correct.

      Rules:
      - Preserve every fact and idea from the original - do not add, invent, or remove information.
      - Fix grammar, spelling, punctuation, and awkward phrasing.
      - Use plain prose. Do NOT use markdown, bullet points, headers, or any special formatting.
      - Match the original language and tone (casual stays casual, formal stays formal).
      - Return only the rewritten note. No preamble, no explanation.

      Note:
      ${content}
    `

    const text = await callGemini(prompt)
    if (!text)
      return {
        success: false,
        message: "The AI returned an empty response. Please try again.",
      }
    return { success: true, data: text }
  } catch (e) {
    return handleError(e, "Rewrite")
  }
}

export async function summarizeNoteAction(
  content: string
): Promise<ActionResult> {
  const invalid = validateContent(content, 20)
  if (invalid) return invalid

  try {
    const prompt = `
      You are a precise summarizer. Read the note below and produce a concise summary.

      Rules:
      - Capture every key point, decision, or action item - nothing important should be lost.
      - Be brief: aim for 20–40% of the original length.
      - Write in plain prose. Do NOT use markdown, bullet points, headers, or any special formatting.
      - Return only the summary. No preamble, no explanation.

      Note:
      ${content}
    `

    const text = await callGemini(prompt)
    if (!text)
      return {
        success: false,
        message: "The AI returned an empty response. Please try again.",
      }
    return { success: true, data: text }
  } catch (e) {
    return handleError(e, "Summarize")
  }
}

export async function askOnSummaryAction(
  summary: string,
  question: string
): Promise<ActionResult> {
  if (!summary)
    return { success: false, message: "No summary available to answer from." }

  const invalid = validateContent(question, 3)
  if (invalid)
    return { success: false, message: "Please enter a valid question." }

  try {
    const prompt = `
      You are a helpful assistant. Answer the question below using ONLY the information provided in the context. Do not draw on outside knowledge.

      Rules:
      - If the context does not contain enough information to answer, say so clearly.
      - Be direct and concise.
      - Write in plain prose. Do NOT use markdown, bullet points, headers, or any special formatting.
      - Return only the answer. No preamble, no explanation.

      Context:
      ${summary}

      Question:
      ${question}
    `

    const text = await callGemini(prompt)
    if (!text)
      return {
        success: false,
        message: "The AI returned an empty response. Please try again.",
      }
    return { success: true, data: text }
  } catch (e) {
    return handleError(e, "Ask")
  }
}
