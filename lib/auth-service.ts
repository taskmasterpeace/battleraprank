"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// In a real app, this would use a proper authentication system
// This is a simplified version for demonstration purposes

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"
const AUTH_COOKIE = "battle_rap_admin_auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function login(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set auth cookie
    cookies().set({
      name: AUTH_COOKIE,
      value: "authenticated",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return true
  }
  return false
}

export async function logout(): Promise<void> {
  cookies().delete(AUTH_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const authCookie = cookies().get(AUTH_COOKIE)
  return authCookie?.value === "authenticated"
}

export async function sendVerificationEmail(email: string): Promise<void> {
  // In a real app, this would send an email with a verification code
  // For now, we'll just simulate it
  console.log(`Sending verification email to ${email}`)

  // In a real app, you would generate a code, store it in the database,
  // and send it to the user's email

  // For demo purposes, we'll just return
  return Promise.resolve()
}

export async function verifyEmail(userId: string, code: string): Promise<{ success: boolean }> {
  // In a real app, this would verify the code against what's stored in the database
  // For now, we'll just simulate it

  // For demo purposes, we'll accept any 6-digit code
  if (code.length === 6 && /^\d+$/.test(code)) {
    // Update the user's verified status in the database
    const { error } = await supabase.from("user_profiles").update({ verified: true }).eq("id", userId)

    if (error) {
      console.error("Error updating user verified status:", error)
      return { success: false }
    }

    return { success: true }
  }

  return { success: false }
}

