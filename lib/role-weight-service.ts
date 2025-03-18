"use server"

import { supabase } from "@/lib/supabase"
import type { RoleWeight, UserRole } from "@/types/auth-types"

// Default weights for each role
const DEFAULT_WEIGHTS: RoleWeight[] = [
  {
    role: "fan",
    weight: 1.0,
    displayName: "Fan",
    description: "Battle rap enthusiasts and viewers",
    color: "blue",
  },
  {
    role: "media",
    weight: 2.0,
    displayName: "Media",
    description: "Battle rap journalists, bloggers, and content creators",
    color: "purple",
  },
  {
    role: "battler",
    weight: 2.5,
    displayName: "Battler",
    description: "Active battle rappers",
    color: "green",
  },
  {
    role: "league_owner",
    weight: 3.0,
    displayName: "League Owner",
    description: "Owners and operators of battle rap leagues",
    color: "amber",
  },
  {
    role: "admin",
    weight: 5.0,
    displayName: "Admin",
    description: "Platform administrators",
    color: "red",
  },
]

export async function getRoleWeights(): Promise<RoleWeight[]> {
  try {
    const { data, error } = await supabase.from("role_weights").select("*")

    if (error) {
      console.error("Error fetching role weights:", error)
      return DEFAULT_WEIGHTS
    }

    return data.length > 0 ? (data as RoleWeight[]) : DEFAULT_WEIGHTS
  } catch (error) {
    console.error("Error in getRoleWeights:", error)
    return DEFAULT_WEIGHTS
  }
}

export async function updateRoleWeight(role: UserRole, weight: number): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase.from("role_weights").update({ weight }).eq("role", role)

  if (error) {
    console.error(`Error updating weight for role ${role}:`, error)
    return { success: false, error }
  }

  return { success: true }
}

export async function resetRoleWeightsToDefault(): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase.from("role_weights").upsert(DEFAULT_WEIGHTS)

  if (error) {
    console.error("Error resetting role weights:", error)
    return { success: false, error }
  }

  return { success: true }
}

