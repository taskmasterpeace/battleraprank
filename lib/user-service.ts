"use server"

import type { UserProfile, SocialLinks, YouTubeChannel, ContentLink } from "@/types/auth-types"
import type { UserPrivacySettings } from "@/components/profile/PrivacySettings"
import { supabase } from "@/lib/supabase"

// Mock data for user profiles
const userProfiles: UserProfile[] = [
  {
    id: "1",
    email: "jay.blac@example.com",
    displayName: "Jay Blac",
    username: "jayblac",
    roles: {
      fan: true,
      media: true,
      battler: false,
      league_owner: false,
      admin: false,
    },
    verified: true,
    createdAt: "2022-01-15T00:00:00Z",
    bio: "Battle rap analyst and host of Champion. Covering the culture since 2009.",
    location: "New York, NY",
    website: "https://champion.example.com",
    profileImage: "/placeholder.svg?height=400&width=400&text=Jay+Blac",
    bannerImage: "/placeholder.svg?height=200&width=1200&text=Champion",
    socialLinks: {
      youtube: "https://youtube.com/champion",
      twitter: "https://twitter.com/jayblac",
      instagram: "https://instagram.com/jayblac",
    },
    youtubeChannels: [
      {
        id: "channel1",
        url: "https://youtube.com/champion",
        name: "Champion",
        description: "The #1 Battle Rap Media Platform",
        subscriberCount: 250000,
        videoCount: 1200,
        viewCount: 45000000,
      },
    ],
    mediaOutlet: "Champion",
    followers: 1245,
    following: 87,
    badges: ["Verified Critic", "Battle Historian", "Top Contributor"],
  },
  {
    id: "2",
    email: "loaded.lux@example.com",
    displayName: "Loaded Lux",
    username: "loadedlux",
    roles: {
      fan: true,
      media: false,
      battler: true,
      league_owner: false,
      admin: false,
    },
    verified: true,
    createdAt: "2022-02-20T00:00:00Z",
    bio: "Harlem legend. You gon get this work.",
    location: "Harlem, NY",
    profileImage: "/placeholder.svg?height=400&width=400&text=Loaded+Lux",
    bannerImage: "/placeholder.svg?height=200&width=1200&text=Loaded+Lux",
    socialLinks: {
      twitter: "https://twitter.com/loadedlux",
      instagram: "https://instagram.com/loadedlux",
    },
    battlerId: "1",
    followers: 2345,
    following: 124,
    badges: ["Elite Battler", "Veteran Member"],
  },
  {
    id: "3",
    email: "url.tv@example.com",
    displayName: "URL TV",
    username: "urltv",
    roles: {
      fan: false,
      media: false,
      battler: false,
      league_owner: true,
      admin: false,
    },
    verified: true,
    createdAt: "2022-01-10T00:00:00Z",
    bio: "Ultimate Rap League - The World's Most Respected Battle Rap Platform",
    location: "New York, NY",
    website: "https://urltv.tv",
    profileImage: "/placeholder.svg?height=400&width=400&text=URL+TV",
    bannerImage: "/placeholder.svg?height=200&width=1200&text=URL+TV",
    socialLinks: {
      youtube: "https://youtube.com/urltv",
      twitter: "https://twitter.com/urltv",
      instagram: "https://instagram.com/urltv",
    },
    youtubeChannels: [
      {
        id: "channel2",
        url: "https://youtube.com/urltv",
        name: "URL TV",
        description: "Ultimate Rap League - The World's Most Respected Battle Rap Platform",
        subscriberCount: 1200000,
        videoCount: 3500,
        viewCount: 350000000,
      },
    ],
    leagueId: "1",
    followers: 5678,
    following: 45,
    badges: ["Verified League", "Platform Pioneer"],
  },
]

// Mock data for user follows
const userFollows: { userId: string; followingId: string }[] = []

// Mock data for user privacy settings
const userPrivacySettings: Record<string, UserPrivacySettings> = {
  "1": {
    visibilityLevel: "medium",
    showEmail: false,
    showRatings: true,
    showBadges: true,
    showHistoricalData: false,
  },
  "2": {
    visibilityLevel: "high",
    showEmail: false,
    showRatings: true,
    showBadges: true,
    showHistoricalData: true,
  },
  "3": {
    visibilityLevel: "medium",
    showEmail: false,
    showRatings: true,
    showBadges: true,
    showHistoricalData: false,
  },
}

// Mock data for community manager requests
interface CommunityManagerRequest {
  id: string
  userId: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

const communityManagerRequests: CommunityManagerRequest[] = [
  {
    id: "1",
    userId: "4",
    reason: "I've been following battle rap for 10 years and have extensive knowledge of the culture.",
    status: "approved",
    createdAt: "2023-05-15T00:00:00Z",
    reviewedAt: "2023-05-17T00:00:00Z",
    reviewedBy: "1",
  },
  {
    id: "2",
    userId: "5",
    reason: "I run a battle rap blog and want to contribute to the platform.",
    status: "pending",
    createdAt: "2023-06-20T00:00:00Z",
  },
]

export async function requestCommunityManagerRole(userId: string, reason: string): Promise<void> {
  // In a real app, this would insert into a database
  const newRequest: CommunityManagerRequest = {
    id: crypto.randomUUID(),
    userId,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  communityManagerRequests.push(newRequest)

  // In a real app, you would also notify admins of the new request
}

export async function getCommunityManagerRequests(): Promise<CommunityManagerRequest[]> {
  // In a real app, this would fetch from a database
  return communityManagerRequests
}

export async function reviewCommunityManagerRequest(
  requestId: string,
  status: "approved" | "rejected",
  reviewerId: string,
): Promise<void> {
  // In a real app, this would update a database record
  const requestIndex = communityManagerRequests.findIndex((req) => req.id === requestId)

  if (requestIndex === -1) {
    throw new Error("Request not found")
  }

  communityManagerRequests[requestIndex] = {
    ...communityManagerRequests[requestIndex],
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerId,
  }

  // If approved, update the user's roles
  if (status === "approved") {
    const userId = communityManagerRequests[requestIndex].userId

    // In a real app, this would update the user's roles in the database
    const userIndex = userProfiles.findIndex((u) => u.id === userId)

    if (userIndex !== -1) {
      userProfiles[userIndex] = {
        ...userProfiles[userIndex],
        roles: {
          ...userProfiles[userIndex].roles,
          community_manager: true,
        },
      }
    }
  }
}

export async function hasPendingCommunityManagerRequest(userId: string): Promise<boolean> {
  // In a real app, this would query your database
  return communityManagerRequests.some((req) => req.userId === userId && req.status === "pending")
}

export async function isCommunityManager(userId: string): Promise<boolean> {
  // In a real app, this would query your database
  const userIndex = userProfiles.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return false
  }

  return !!userProfiles[userIndex].roles.community_manager
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  // In a real app, this would query your database
  const user = userProfiles.find((u) => u.username === username)
  return user || null
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  // In a real app, this would update your database
  const userIndex = userProfiles.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  const updatedUser = {
    ...userProfiles[userIndex],
    ...data,
  }

  userProfiles[userIndex] = updatedUser

  return updatedUser
}

export async function updateUserSocialLinks(userId: string, links: SocialLinks): Promise<UserProfile> {
  // In a real app, this would update your database
  const userIndex = userProfiles.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  const updatedUser = {
    ...userProfiles[userIndex],
    socialLinks: links,
  }

  userProfiles[userIndex] = updatedUser

  return updatedUser
}

export async function updateUserYouTubeChannels(userId: string, channels: YouTubeChannel[]): Promise<UserProfile> {
  // In a real app, this would update your database
  const userIndex = userProfiles.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  const updatedUser = {
    ...userProfiles[userIndex],
    youtubeChannels: channels,
  }

  userProfiles[userIndex] = updatedUser

  return updatedUser
}

export async function getUserPrivacySettings(userId: string): Promise<UserPrivacySettings | null> {
  // In a real app, this would query your database
  return userPrivacySettings[userId] || null
}

export async function updateUserPrivacySettings(
  userId: string,
  settings: UserPrivacySettings,
): Promise<UserPrivacySettings> {
  // In a real app, this would update your database
  userPrivacySettings[userId] = settings
  return settings
}

export async function followUser(followingId: string): Promise<void> {
  // In a real app, this would update your database
  // For now, we'll just use the first user as the current user
  const currentUserId = "1"

  // Check if already following
  const alreadyFollowing = userFollows.some(
    (follow) => follow.userId === currentUserId && follow.followingId === followingId,
  )

  if (!alreadyFollowing) {
    userFollows.push({
      userId: currentUserId,
      followingId,
    })

    // Update follower count
    const userIndex = userProfiles.findIndex((u) => u.id === followingId)
    if (userIndex !== -1) {
      userProfiles[userIndex].followers = (userProfiles[userIndex].followers || 0) + 1
    }

    // Update following count
    const currentUserIndex = userProfiles.findIndex((u) => u.id === currentUserId)
    if (currentUserIndex !== -1) {
      userProfiles[currentUserIndex].following = (userProfiles[currentUserIndex].following || 0) + 1
    }
  }
}

export async function unfollowUser(followingId: string): Promise<void> {
  // In a real app, this would update your database
  // For now, we'll just use the first user as the current user
  const currentUserId = "1"

  // Remove follow relationship
  const followIndex = userFollows.findIndex(
    (follow) => follow.userId === currentUserId && follow.followingId === followingId,
  )

  if (followIndex !== -1) {
    userFollows.splice(followIndex, 1)

    // Update follower count
    const userIndex = userProfiles.findIndex((u) => u.id === followingId)
    if (userIndex !== -1 && userProfiles[userIndex].followers) {
      userProfiles[userIndex].followers -= 1
    }

    // Update following count
    const currentUserIndex = userProfiles.findIndex((u) => u.id === currentUserId)
    if (currentUserIndex !== -1 && userProfiles[currentUserIndex].following) {
      userProfiles[currentUserIndex].following -= 1
    }
  }
}

export async function getUserFollowers(userId: string): Promise<UserProfile[]> {
  // In a real app, this would query your database
  const followerIds = userFollows.filter((follow) => follow.followingId === userId).map((follow) => follow.userId)

  return userProfiles.filter((user) => followerIds.includes(user.id))
}

export async function getUserFollowing(userId: string): Promise<UserProfile[]> {
  // In a real app, this would query your database
  const followingIds = userFollows.filter((follow) => follow.userId === userId).map((follow) => follow.followingId)

  return userProfiles.filter((user) => followingIds.includes(user.id))
}

export async function isFollowing(userId: string, followingId: string): Promise<boolean> {
  // In a real app, this would query your database
  return userFollows.some((follow) => follow.userId === userId && follow.followingId === followingId)
}

export async function getAllUsers(): Promise<UserProfile[]> {
  // In a real app, this would query your database
  return userProfiles
}

export async function getCommunityManagers(): Promise<UserProfile[]> {
  // In a real app, this would fetch from your database
  const { data, error } = await supabase.from("user_profiles").select("*").eq("roles->community_manager", true)

  if (error) {
    console.error("Error fetching community managers:", error)
    throw error
  }

  return data as UserProfile[]
}

export async function addCommunityManager(email: string): Promise<UserProfile> {
  // First, check if the user exists
  const { data: user, error: userError } = await supabase.from("user_profiles").select("*").eq("email", email).single()

  if (userError || !user) {
    throw new Error("User not found")
  }

  // Update the user's roles
  const updatedRoles = {
    ...user.roles,
    community_manager: true,
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ roles: updatedRoles })
    .eq("id", user.id)
    .select("*")
    .single()

  if (error) {
    console.error("Error adding community manager:", error)
    throw error
  }

  return data as UserProfile
}

export async function removeCommunityManager(userId: string): Promise<void> {
  // Get the user's current roles
  const { data: user, error: userError } = await supabase
    .from("user_profiles")
    .select("roles")
    .eq("id", userId)
    .single()

  if (userError || !user) {
    throw new Error("User not found")
  }

  // Update the user's roles
  const updatedRoles = { ...user.roles, community_manager: false }

  const { error } = await supabase.from("user_profiles").update({ roles: updatedRoles }).eq("id", userId)

  if (error) {
    console.error("Error removing community manager:", error)
    throw error
  }
}

export async function getUserContentLinks(userId: string): Promise<ContentLink[]> {
  // In a real app, this would fetch from your database
  const { data, error } = await supabase
    .from("content_links")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })

  if (error) {
    console.error("Error fetching content links:", error)
    throw error
  }

  return data as ContentLink[]
}

export async function addContentLink(link: Omit<ContentLink, "id" | "createdAt" | "likes">): Promise<ContentLink> {
  const newLink = {
    ...link,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    likes: 0,
  }

  const { data, error } = await supabase.from("content_links").insert(newLink).select("*").single()

  if (error) {
    console.error("Error adding content link:", error)
    throw error
  }

  return data as ContentLink
}

export async function deleteContentLink(id: string): Promise<void> {
  const { error } = await supabase.from("content_links").delete().eq("id", id)

  if (error) {
    console.error("Error deleting content link:", error)
    throw error
  }
}

export async function likeContentLink(id: string): Promise<void> {
  // In a real app, you would track which users have liked which content
  // For now, we'll just increment the likes count
  const { data, error } = await supabase.from("content_links").select("likes").eq("id", id).single()

  if (error) {
    console.error("Error fetching content link:", error)
    throw error
  }

  const { error: updateError } = await supabase
    .from("content_links")
    .update({ likes: (data.likes || 0) + 1 })
    .eq("id", id)

  if (updateError) {
    console.error("Error liking content link:", updateError)
    throw updateError
  }
}

import type { Battler } from "@/types/auth-types"

export async function getUserAddedBattlers(userId: string): Promise<Battler[]> {
  // In a real app, this would query your database
  const { data, error } = await supabase
    .from("battlers")
    .select("*")
    .eq("addedBy", userId)
    .order("createdAt", { ascending: false })

  if (error) {
    console.error("Error fetching user added battlers:", error)
    throw error
  }

  return data as Battler[]
}

export async function updateUserAddedBattler(userId: string, battleId: string): Promise<void> {
  // In a real app, this would update the user's addedBattlers array
  const { data: user, error: userError } = await supabase
    .from("user_profiles")
    .select("addedBattlers")
    .eq("id", userId)
    .single()

  if (userError) {
    console.error("Error fetching user:", userError)
    throw userError
  }

  const addedBattlers = user?.addedBattlers || []

  const { error } = await supabase
    .from("user_profiles")
    .update({ addedBattlers: [...addedBattlers, battleId] })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user's addedBattlers:", error)
    throw error
  }
}

