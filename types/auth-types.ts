export type UserRole = "fan" | "media" | "battler" | "league_owner" | "admin" | "community_manager"

export interface RoleWeight {
  role: UserRole
  weight: number
  displayName: string
  description: string
  color: string
}

export interface UserRoles {
  fan: boolean
  media: boolean
  battler: boolean
  league_owner: boolean
  admin: boolean
  community_manager: boolean
}

export interface SocialLinks {
  youtube?: string
  twitter?: string
  instagram?: string
  website?: string
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  username: string
  roles: UserRoles
  verified: boolean
  createdAt: string
  bio?: string
  location?: string
  website?: string
  profileImage?: string
  bannerImage?: string
  socialLinks: SocialLinks
  battlerId?: string // If user is a battler, link to their battler profile
  leagueId?: string // If user is a league owner, link to their league
  mediaOutlet?: string // If user is media, their outlet name
  followers?: number
  following?: number
  badges?: string[] // Special badges assigned to the user
  privacySettings?: {
    visibilityLevel: "low" | "medium" | "high"
    showEmail: boolean
    showRatings: boolean
    showBadges: boolean
    showHistoricalData: boolean
  }
  contentLinks?: ContentLink[]
  addedBattlers?: string[] // IDs of battlers added by this user
}

export interface ContentLink {
  id: string
  userId: string
  url: string
  displayName: string
  type: "youtube" | "article" | "podcast" | "other"
  thumbnail?: string
  createdAt: string
  likes: number
  views?: number
}

