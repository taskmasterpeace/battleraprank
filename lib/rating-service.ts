"use server"

import { supabase } from "@/lib/supabase"
import { getRoleWeights } from "./role-weight-service"
import type { UserRole } from "@/types/auth-types"
import type { UserRating } from "@/types/rating-types"

interface Rating {
  id: string
  userId: string
  battlerId: string
  category: string
  attribute: string
  value: number
  createdAt: string
  updatedAt: string
}

interface Rating {
  id: string
  userId: string
  battlerId: string
  category: string
  attribute: string
  value: number
  createdAt: string
  updatedAt: string
}

export async function submitRating(
  userId: string,
  battlerId: string,
  category: string,
  attribute: string,
  value: number,
): Promise<{ success: boolean; error?: any }> {
  // Check if rating already exists
  const { data: existingRating } = await supabase
    .from("ratings")
    .select("*")
    .eq("userId", userId)
    .eq("battlerId", battlerId)
    .eq("category", category)
    .eq("attribute", attribute)
    .single()

  if (existingRating) {
    // Update existing rating
    const { error } = await supabase
      .from("ratings")
      .update({
        value,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", existingRating.id)

    if (error) {
      console.error("Error updating rating:", error)
      return { success: false, error }
    }
  } else {
    // Create new rating
    const { error } = await supabase.from("ratings").insert({
      userId,
      battlerId,
      category,
      attribute,
      value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating rating:", error)
      return { success: false, error }
    }
  }

  // Recalculate battler's weighted average for this attribute
  await recalculateWeightedAverage(battlerId, category, attribute)

  return { success: true }
}

async function recalculateWeightedAverage(battlerId: string, category: string, attribute: string): Promise<void> {
  // Get all ratings for this battler, category, and attribute
  const { data: ratings } = await supabase
    .from("ratings")
    .select("userId, value")
    .eq("battlerId", battlerId)
    .eq("category", category)
    .eq("attribute", attribute)

  if (!ratings || ratings.length === 0) return

  // Get user roles for all users who rated
  const userIds = ratings.map((r) => r.userId)
  const { data: userProfiles } = await supabase.from("user_profiles").select("id, roles").in("id", userIds)

  if (!userProfiles) return

  // Get role weights
  const roleWeights = await getRoleWeights()
  const weightMap = roleWeights.reduce(
    (map, rw) => {
      map[rw.role] = rw.weight
      return map
    },
    {} as Record<UserRole, number>,
  )

  // Prepare ratings with user roles
  const userRatings: UserRating[] = ratings.map((rating) => {
    const userProfile = userProfiles.find((up) => up.id === rating.userId)

    // Determine primary role (highest weighted role the user has)
    let primaryRole: UserRole = "fan"
    let highestWeight = 0

    if (userProfile) {
      Object.entries(userProfile.roles).forEach(([role, hasRole]) => {
        if (hasRole && weightMap[role as UserRole] > highestWeight) {
          highestWeight = weightMap[role as UserRole]
          primaryRole = role as UserRole
        }
      })
    }

    return {
      userId: rating.userId,
      userRole: primaryRole,
      value: rating.value,
    }
  })

  // Calculate weighted averages by role
  const roleAverages: Record<UserRole, { sum: number; count: number }> = {
    fan: { sum: 0, count: 0 },
    media: { sum: 0, count: 0 },
    battler: { sum: 0, count: 0 },
    league_owner: { sum: 0, count: 0 },
    admin: { sum: 0, count: 0 },
  }

  userRatings.forEach((rating) => {
    roleAverages[rating.userRole].sum += rating.value
    roleAverages[rating.userRole].count += 1
  })

  // Calculate final averages for each role
  const finalRoleAverages: Record<UserRole, number> = {} as Record<UserRole, number>
  let totalWeightedSum = 0
  let totalWeightedCount = 0

  Object.entries(roleAverages).forEach(([role, data]) => {
    if (data.count > 0) {
      const roleAvg = data.sum / data.count
      finalRoleAverages[role as UserRole] = roleAvg

      const roleWeight = weightMap[role as UserRole]
      totalWeightedSum += roleAvg * roleWeight * data.count
      totalWeightedCount += roleWeight * data.count
    }
  })

  // Calculate overall weighted average
  const overallWeightedAverage = totalWeightedCount > 0 ? totalWeightedSum / totalWeightedCount : 0

  // Update battler_attributes table with new averages
  await supabase.from("battler_attributes").upsert({
    battlerId,
    category,
    attribute,
    overallAverage: overallWeightedAverage,
    fanAverage: finalRoleAverages.fan || 0,
    mediaAverage: finalRoleAverages.media || 0,
    battlerAverage: finalRoleAverages.battler || 0,
    leagueOwnerAverage: finalRoleAverages.league_owner || 0,
    updatedAt: new Date().toISOString(),
  })
}

export async function getBattlerAttributeAverages(battlerId: string, category?: string): Promise<any[]> {
  let query = supabase.from("battler_attributes").select("*").eq("battlerId", battlerId)

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching battler attribute averages:", error)
    return []
  }

  return data || []
}

export async function getTopBattlersByRole(
  role: UserRole,
  category?: string,
  attribute?: string,
  limit = 10,
): Promise<any[]> {
  try {
    let query = supabase.from("battler_attributes")

    // Select the appropriate average column based on role
    let averageColumn = "overallAverage"
    switch (role) {
      case "fan":
        averageColumn = "fanAverage"
        break
      case "media":
        averageColumn = "mediaAverage"
        break
      case "battler":
        averageColumn = "battlerAverage"
        break
      case "league_owner":
        averageColumn = "leagueOwnerAverage"
        break
    }

    // Build the query
    query = query
      .select(`
        battlerId,
        category,
        attribute,
        ${averageColumn}
      `)
      .order(averageColumn, { ascending: false })
      .limit(limit)

    if (category) {
      query = query.eq("category", category)
    }

    if (attribute) {
      query = query.eq("attribute", attribute)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching top battlers by ${role}:`, error)
      // Return empty array on error
      return []
    }

    // Join with battler data to get names and other info
    if (data && data.length > 0) {
      const battlerIds = data.map((item) => item.battlerId)
      const { data: battlers } = await supabase.from("battlers").select("*").in("id", battlerIds)

      if (battlers) {
        return data.map((item) => {
          const battler = battlers.find((b) => b.id === item.battlerId)
          return {
            ...item,
            battlerName: battler?.name || "Unknown",
            battlerImage: battler?.image || "",
            battlerLocation: battler?.location || "",
            rating: item[averageColumn],
          }
        })
      }
    }

    return data || []
  } catch (error) {
    console.error(`Error in getTopBattlersByRole:`, error)
    return []
  }
}

// Mock data for user ratings
const userRatings: UserRating[] = [
  {
    id: "1",
    userId: "1",
    battlerId: "1",
    battlerName: "Loaded Lux",
    battlerImage: "/placeholder.svg?height=300&width=300&text=Loaded+Lux",
    rating: 9.2,
    badges: {
      positive: ["Wordsmith", "Scheme King", "Battle IQ"],
      negative: ["Inconsistent"],
    },
    createdAt: "2023-05-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    battlerId: "3",
    battlerName: "Geechi Gotti",
    battlerImage: "/placeholder.svg?height=300&width=300&text=Geechi+Gotti",
    rating: 9.0,
    badges: {
      positive: ["Authentic", "Consistent", "Crowd Control"],
      negative: [],
    },
    createdAt: "2023-05-10T00:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    battlerId: "4",
    battlerName: "Rum Nitty",
    battlerImage: "/placeholder.svg?height=300&width=300&text=Rum+Nitty",
    rating: 8.9,
    badges: {
      positive: ["Puncher", "Wordplay"],
      negative: ["Stage Presence"],
    },
    createdAt: "2023-05-05T00:00:00Z",
  },
]

export async function getUserRatings(userId: string): Promise<UserRating[]> {
  // In a real app, this would query your database
  return userRatings
    .filter((rating) => rating.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

