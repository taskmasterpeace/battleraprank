"use server"

import { redirect } from "next/navigation"
import type { UserProfile, SocialLinks, ContentLink } from "@/types/auth-types"
import type { UserPrivacySettings } from "@/components/profile/PrivacySettings"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

/**
 * Gets a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error || !data) {
      console.error('Error getting user profile:', error)
      return null
    }
    
    return data as UserProfile
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Gets a user's privacy settings
 */
export async function getUserPrivacySettings(userId: string): Promise<UserPrivacySettings | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('user_privacy_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      // If no settings exist yet, create default settings
      if (error.code === 'PGRST116') {
        const defaultSettings: UserPrivacySettings = {
          visibilityLevel: "medium",
          showEmail: false,
          showRatings: true,
          showBadges: true,
          showHistoricalData: false
        }
        
        return defaultSettings
      }
      
      console.error('Error getting user privacy settings:', error)
      return null
    }
    
    return data as UserPrivacySettings
  } catch (error) {
    console.error('Error getting user privacy settings:', error)
    return null
  }
}

/**
 * Updates a user's privacy settings
 */
export async function updateUserPrivacySettings(
  userId: string,
  settings: UserPrivacySettings,
): Promise<UserPrivacySettings> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('user_privacy_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user privacy settings:', checkError)
      throw new Error('Failed to update privacy settings')
    }
    
    // If settings exist, update them; otherwise, insert new settings
    const operation = existingSettings 
      ? supabase.from('user_privacy_settings').update(settings).eq('user_id', userId)
      : supabase.from('user_privacy_settings').insert({ ...settings, user_id: userId })
    
    const { error } = await operation
    
    if (error) {
      console.error('Error updating user privacy settings:', error)
      throw new Error('Failed to update privacy settings')
    }
    
    return settings
  } catch (error) {
    console.error('Error updating user privacy settings:', error)
    throw new Error('Failed to update privacy settings')
  }
}

/**
 * Follows a user
 */
export async function followUser(followingId: string): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting current user:', userError)
      throw new Error('You must be logged in to follow a user')
    }
    
    // Check if already following
    const { data: existingFollow, error: checkError } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('followed_id', followingId)
      .single()
    
    if (existingFollow) {
      // Already following, no action needed
      return
    }
    
    // Create the follow relationship
    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: user.id,
        followed_id: followingId
      })
    
    if (error) {
      console.error('Error following user:', error)
      throw new Error('Failed to follow user')
    }
  } catch (error) {
    console.error('Error following user:', error)
    throw error
  }
}

/**
 * Unfollows a user
 */
export async function unfollowUser(followingId: string): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting current user:', userError)
      throw new Error('You must be logged in to unfollow a user')
    }
    
    // Delete the follow relationship
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('followed_id', followingId)
    
    if (error) {
      console.error('Error unfollowing user:', error)
      throw new Error('Failed to unfollow user')
    }
  } catch (error) {
    console.error('Error unfollowing user:', error)
    throw error
  }
}

/**
 * Get a user's followers
 */
export async function getUserFollowers(userId: string): Promise<UserProfile[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get followers IDs
    const { data: follows, error: followsError } = await supabase
      .from('user_follows')
      .select('follower_id')
      .eq('followed_id', userId)
    
    if (followsError || !follows || follows.length === 0) {
      return []
    }
    
    // Get follower profiles
    const followerIds = follows.map(follow => follow.follower_id)
    
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', followerIds)
    
    if (profilesError || !profiles) {
      console.error('Error getting follower profiles:', profilesError)
      return []
    }
    
    return profiles as UserProfile[]
  } catch (error) {
    console.error('Error getting user followers:', error)
    return []
  }
}

/**
 * Get users a user is following
 */
export async function getUserFollowing(userId: string): Promise<UserProfile[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get following IDs
    const { data: follows, error: followsError } = await supabase
      .from('user_follows')
      .select('followed_id')
      .eq('follower_id', userId)
    
    if (followsError || !follows || follows.length === 0) {
      return []
    }
    
    // Get following profiles
    const followingIds = follows.map(follow => follow.followed_id)
    
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', followingIds)
    
    if (profilesError || !profiles) {
      console.error('Error getting following profiles:', profilesError)
      return []
    }
    
    return profiles as UserProfile[]
  } catch (error) {
    console.error('Error getting user following:', error)
    return []
  }
}

/**
 * Check if a user is following another user
 */
export async function isFollowing(userId: string, followingId: string): Promise<boolean> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', userId)
      .eq('followed_id', followingId)
      .single()
    
    return !!data && !error
  } catch (error) {
    console.error('Error checking if following:', error)
    return false
  }
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (error || !data) {
      console.error('Error getting all users:', error)
      return []
    }
    
    return data as UserProfile[]
  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
}

/**
 * Get all community managers
 */
export async function getCommunityManagers(): Promise<UserProfile[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('roles->community_manager', true)
    
    if (error || !data) {
      console.error('Error getting community managers:', error)
      return []
    }
    
    return data as UserProfile[]
  } catch (error) {
    console.error('Error getting community managers:', error)
    return []
  }
}

/**
 * Confirm a media user
 */
export async function confirmMediaUser(userId: string): Promise<UserProfile> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if the current user is taskmasterpeace or an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("You must be logged in to confirm media users")
    
    const { data: currentProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, roles')
      .eq('id', user.id)
      .single()
    
    if (profileError || !currentProfile) {
      throw new Error("Error fetching your profile")
    }
    
    const isTaskmasterpeace = currentProfile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
    const isAdmin = currentProfile.roles?.admin === true
    
    if (!isTaskmasterpeace && !isAdmin) {
      throw new Error("Only taskmasterpeace and admins can confirm media users")
    }
    
    // Find the user to update
    const { data: userToUpdate, error: findError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (findError || !userToUpdate) {
      throw new Error("User not found")
    }
    
    // Make sure the user is a media user
    if (!userToUpdate.roles?.media) {
      throw new Error("This user is not a media user")
    }
    
    // Update the user's roles
    const updatedRoles = { 
      ...userToUpdate.roles, 
      media_confirmed: true 
    }
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_profiles')
      .update({ roles: updatedRoles })
      .eq('id', userToUpdate.id)
      .select('*')
      .single()
    
    if (updateError || !updatedUser) {
      throw new Error("Error updating user roles")
    }
    
    return updatedUser as UserProfile
  } catch (error: any) {
    console.error("Error confirming media user:", error)
    throw new Error(error.message || "Error confirming media user")
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: string): Promise<UserProfile[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if the current user is taskmasterpeace or an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("You must be logged in to view users by role")
    
    const { data: currentProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, roles')
      .eq('id', user.id)
      .single()
    
    if (profileError || !currentProfile) {
      throw new Error("Error fetching your profile")
    }
    
    const isTaskmasterpeace = currentProfile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
    const isAdmin = currentProfile.roles?.admin === true
    
    if (!isTaskmasterpeace && !isAdmin) {
      throw new Error("Only taskmasterpeace and admins can view users by role")
    }
    
    let query = supabase
      .from('user_profiles')
      .select('*')
    
    // Filter based on the requested role
    if (role === 'admin') {
      query = query.filter('roles->admin', 'eq', true)
    } else if (role === 'community_manager') {
      query = query.filter('roles->community_manager', 'eq', true)
    } else if (role === 'media') {
      query = query.filter('roles->media', 'eq', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error("Error fetching users by role")
    }
    
    return data as UserProfile[] || []
  } catch (error: any) {
    console.error("Error getting users by role:", error)
    throw new Error(error.message || "Error getting users by role")
  }
}

/**
 * Add a user as an admin
 */
export async function addAdmin(email: string): Promise<UserProfile> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if the current user is taskmasterpeace
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("You must be logged in to add an admin")
    
    const { data: currentProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, roles')
      .eq('id', user.id)
      .single()
    
    if (profileError || !currentProfile) {
      throw new Error("Error fetching your profile")
    }
    
    const isTaskmasterpeace = currentProfile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
    
    if (!isTaskmasterpeace) {
      throw new Error("Only taskmasterpeace can add admins")
    }
    
    // Find the user to update
    const { data: userToUpdate, error: findError } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('email', email)
      .single()
    
    if (findError || !userToUpdate) {
      throw new Error("User not found with this email")
    }
    
    // Update the user's roles
    const updatedRoles = { 
      ...userToUpdate.roles, 
      admin: true 
    }
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_profiles')
      .update({ roles: updatedRoles })
      .eq('id', userToUpdate.id)
      .select('*')
      .single()
    
    if (updateError || !updatedUser) {
      throw new Error("Error updating user roles")
    }
    
    return updatedUser as UserProfile
  } catch (error: any) {
    console.error("Error adding admin:", error)
    throw new Error(error.message || "Error adding admin")
  }
}

/**
 * Remove a user's admin role
 */
export async function removeAdmin(userId: string): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if the current user is taskmasterpeace
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("You must be logged in to remove an admin")
    
    const { data: currentProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, roles')
      .eq('id', user.id)
      .single()
    
    if (profileError || !currentProfile) {
      throw new Error("Error fetching your profile")
    }
    
    const isTaskmasterpeace = currentProfile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
    
    if (!isTaskmasterpeace) {
      throw new Error("Only taskmasterpeace can remove admins")
    }
    
    // Find the user to update
    const { data: userToUpdate, error: findError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (findError || !userToUpdate) {
      throw new Error("User not found")
    }
    
    // Can't remove taskmasterpeace as an admin
    if (userToUpdate.email?.toLowerCase() === "taskmasterpeace@gmail.com") {
      throw new Error("Cannot remove taskmasterpeace's admin role")
    }
    
    // Update the user's roles
    const updatedRoles = { 
      ...userToUpdate.roles, 
      admin: false 
    }
    
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ roles: updatedRoles })
      .eq('id', userId)
    
    if (updateError) {
      throw new Error("Error updating user roles")
    }
  } catch (error: any) {
    console.error("Error removing admin:", error)
    throw new Error(error.message || "Error removing admin")
  }
}
