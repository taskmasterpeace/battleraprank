import type { UserRoles } from "./auth-types"

export interface UserStats {
  id: string
  displayName: string
  username: string
  profileImage?: string
  roles: UserRoles
  totalRatings: number
  accuracyScore: number
  followers: number
  isFollowedByCurrentUser: boolean
  badges?: string[] // Special badges assigned to the user
}

export interface CommunityStats {
  totalUsers: number
  newUsersThisWeek: number
  totalRatings: number
  newRatingsThisWeek: number
  averageRating: number
  activeUsers: number
  roleBreakdown: {
    role: string
    percentage: number
  }[]
  ratingDistribution: {
    range: string
    percentage: number
  }[]
}

