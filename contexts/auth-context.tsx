"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import type { UserProfile, UserRole, UserRoles } from "@/types/auth-types"

type AuthContextType = {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, roles: UserRoles) => Promise<{ error: any; data: any }>
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserRoles: (roles: UserRoles) => Promise<{ error: any }>
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }

      setIsLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return
    }

    if (data) {
      setUserProfile(data as UserProfile)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      router.refresh()
    }
    return { error }
  }

  const signUp = async (email: string, password: string, roles: UserRoles) => {
    // First create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          roles: roles,
        },
      },
    })

    if (!error && data.user) {
      // Create the user profile with roles
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: data.user.id,
        email: data.user.email,
        displayName: email.split("@")[0],
        roles: roles,
        verified: false,
        createdAt: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }
    }

    return { data, error }
  }

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo ? `${window.location.origin}${redirectTo}` : `${window.location.origin}/`,
        },
      })

      if (error) {
        console.error("Error signing in with Google:", error)
        throw error
      }
    } catch (error) {
      console.error("Exception during Google sign-in:", error)
      throw error
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  const updateUserRoles = async (roles: UserRoles) => {
    if (!user) return { error: new Error("User not authenticated") }

    const { error } = await supabase.from("user_profiles").update({ roles }).eq("id", user.id)

    if (!error) {
      setUserProfile((prev) => (prev ? { ...prev, roles } : null))
    }

    return { error }
  }

  const hasRole = (role: UserRole): boolean => {
    if (!userProfile) return false
    return userProfile.roles[role] === true
  }

  const value = {
    user,
    session,
    userProfile,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserRoles,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

