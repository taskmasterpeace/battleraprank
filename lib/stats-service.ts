"use server"

import type { UserStats, LeaderboardEntry, TopContributor } from "@/types/stats-types"

// Mock data for user stats
const userStats: Record<string, UserStats> = {
  "1": {
    totalRatings: 247,
    averageRating: 8.4,
    battlersCovered: 89,
    consistency: 92,
    influence: 87,
    recentActivity: "high",
    contributionStreak: 14,
    topGenres: ["URL", "KOTD", "RBE"],
    favoriteRappers: ["Loaded Lux", "Rum Nitty", "Geechi Gotti"],
  },
  "2": {
    totalRatings: 156,
    averageRating: 7.9,
    battlersCovered: 62,
    consistency: 85,
    influence: 76,
    recentActivity: "medium",
    contributionStreak: 5,
    topGenres: ["URL", "RBE", "iBattle"],
    favoriteRappers: ["Tay Roc", "Hitman Holla", "JC"],
  },
}

// Mock data for leaderboard
const leaderboard: LeaderboardEntry[] = [
  {
    userId: "1",
    username: "jayblac",
    displayName: "Jay Blac",
    profileImage: "/placeholder.svg?height=400&width=400&text=Jay+Blac",
    totalRatings: 247,
    consistency: 92,
    influence: 87,
    rank: 1,
  },
  {
    userId: "3",
    username: "queenzflip",
    displayName: "QueenzFlip",
    profileImage: "/placeholder.svg?height=400&width=400&text=QueenzFlip",
    totalRatings: 203,
    consistency: 88,
    influence: 85,
    rank: 2,
  },
  {
    userId: "4",
    username: "15minutesoffame",
    displayName: "15 Minutes of Fame",
    profileImage: "/placeholder.svg?height=400&width=400&text=15MOF",
    totalRatings: 189,
    consistency: 90,
    influence: 82,
    rank: 3,
  },
  {
    userId: "2",
    username: "loadedlux",
    displayName: "Loaded Lux",
    profileImage: "/placeholder.svg?height=400&width=400&text=Loaded+Lux",
    totalRatings: 156,
    consistency: 85,
    influence: 76,
    rank: 4,
  },
  {
    userId: "5",
    username: "battletruth",
    displayName: "Battle Truth",
    profileImage: "/placeholder.svg?height=400&width=400&text=Battle+Truth",
    totalRatings: 142,
    consistency: 82,
    influence: 79,
    rank: 5,
  },
]

// Mock data for top contributors
const topContributors: TopContributor[] = [
  {
    userId: "1",
    username: "jayblac",
    displayName: "Jay Blac",
    profileImage: "/placeholder.svg?height=400&width=400&text=Jay+Blac",
    contribution: "Most Consistent Ratings",
    score: 92,
    description: "Provides highly consistent ratings across all battlers",
  },
  {
    userId: "3",
    username: "queenzflip",
    displayName: "QueenzFlip",
    profileImage: "/placeholder.svg?height=400&width=400&text=QueenzFlip",
    contribution: "Most Active Reviewer",
    score: 203,
    description: "Highest number of active reviews in the past month",
  },
  {
    userId: "4",
    username: "15minutesoffame",
    displayName: "15 Minutes of Fame",
    profileImage: "/placeholder.svg?height=400&width=400&text=15MOF",
    contribution: "Community Influencer",
    score: 82,
    description: "Ratings that most closely align with community consensus",
  },
]

// Mock historical data
const userHistoricalData: Record<string, any> = {
  "1": {
    activity: [
      { date: "2023-01-01", ratings: 12, comments: 24 },
      { date: "2023-02-01", ratings: 15, comments: 30 },
      { date: "2023-03-01", ratings: 18, comments: 27 },
      { date: "2023-04-01", ratings: 22, comments: 35 },
      { date: "2023-05-01", ratings: 20, comments: 32 },
      { date: "2023-06-01", ratings: 25, comments: 40 },
      { date: "2023-07-01", ratings: 28, comments: 45 },
      { date: "2023-08-01", ratings: 30, comments: 38 },
      { date: "2023-09-01", ratings: 27, comments: 42 },
      { date: "2023-10-01", ratings: 32, comments: 50 },
      { date: "2023-11-01", ratings: 35, comments: 48 },
      { date: "2023-12-01", ratings: 38, comments: 55 },
    ],
    ratingTrends: [
      { date: "2023-01-01", average: 7.8, consistency: 80 },
      { date: "2023-02-01", average: 7.9, consistency: 82 },
      { date: "2023-03-01", average: 8.0, consistency: 83 },
      { date: "2023-04-01", average: 8.1, consistency: 85 },
      { date: "2023-05-01", average: 8.2, consistency: 86 },
      { date: "2023-06-01", average: 8.2, consistency: 87 },
      { date: "2023-07-01", average: 8.3, consistency: 88 },
      { date: "2023-08-01", average: 8.3, consistency: 89 },
      { date: "2023-09-01", average: 8.4, consistency: 90 },
      { date: "2023-10-01", average: 8.4, consistency: 91 },
      { date: "2023-11-01", average: 8.4, consistency: 92 },
      { date: "2023-12-01", average: 8.5, consistency: 92 },
    ],
    achievements: {
      badges: [
        {
          name: "Verified Critic",
          description: "Recognized as an official battle rap critic",
          date: "2023-02-15",
        },
        {
          name: "Battle Historian",
          description: "Demonstrated extensive knowledge of battle rap history",
          date: "2023-05-20",
        },
        {
          name: "Top Contributor",
          description: "Among the top 1% of contributors on the platform",
          date: "2023-08-10",
        },
        {
          name: "Consistency King",
          description: "Maintained high consistency in ratings for 6 months",
          date: "2023-11-05",
        },
      ],
      milestones: [
        {
          title: "100 Ratings",
          description: "Submitted 100 battler ratings",
          date: "2023-04-12",
        },
        {
          title: "200 Ratings",
          description: "Submitted 200 battler ratings",
          date: "2023-09-28",
        },
        {
          title: "50 Battlers",
          description: "Rated 50 different battlers",
          date: "2023-06-03",
        },
        {
          title: "30-Day Streak",
          description: "Maintained activity for 30 consecutive days",
          date: "2023-10-15",
        },
      ],
    },
  },
  "2": {
    activity: [
      { date: "2023-01-01", ratings: 8, comments: 15 },
      { date: "2023-02-01", ratings: 10, comments: 18 },
      { date: "2023-03-01", ratings: 12, comments: 20 },
      { date: "2023-04-01", ratings: 15, comments: 25 },
      { date: "2023-05-01", ratings: 14, comments: 22 },
      { date: "2023-06-01", ratings: 18, comments: 28 },
      { date: "2023-07-01", ratings: 20, comments: 30 },
      { date: "2023-08-01", ratings: 22, comments: 32 },
      { date: "2023-09-01", ratings: 19, comments: 29 },
      { date: "2023-10-01", ratings: 24, comments: 35 },
      { date: "2023-11-01", ratings: 26, comments: 38 },
      { date: "2023-12-01", ratings: 28, comments: 40 },
    ],
    ratingTrends: [
      { date: "2023-01-01", average: 7.2, consistency: 75 },
      { date: "2023-02-01", average: 7.3, consistency: 76 },
      { date: "2023-03-01", average: 7.4, consistency: 77 },
      { date: "2023-04-01", average: 7.5, consistency: 78 },
      { date: "2023-05-01", average: 7.6, consistency: 79 },
      { date: "2023-06-01", average: 7.6, consistency: 80 },
      { date: "2023-07-01", average: 7.7, consistency: 81 },
      { date: "2023-08-01", average: 7.7, consistency: 82 },
      { date: "2023-09-01", average: 7.8, consistency: 83 },
      { date: "2023-10-01", average: 7.8, consistency: 84 },
      { date: "2023-11-01", average: 7.9, consistency: 85 },
      { date: "2023-12-01", average: 7.9, consistency: 85 },
    ],
    achievements: {
      badges: [
        {
          name: "Elite Battler",
          description: "Recognized as an elite battle rapper",
          date: "2023-03-10",
        },
        {
          name: "Veteran Member",
          description: "Active member for over 1 year",
          date: "2023-07-15",
        },
      ],
      milestones: [
        {
          title: "50 Ratings",
          description: "Submitted 50 battler ratings",
          date: "2023-05-20",
        },
        {
          title: "100 Ratings",
          description: "Submitted 100 battler ratings",
          date: "2023-10-12",
        },
        {
          title: "25 Battlers",
          description: "Rated 25 different battlers",
          date: "2023-08-05",
        },
      ],
    },
  },
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  // In a real app, this would query your database
  return userStats[userId] || null
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  // In a real app, this would query your database
  return leaderboard
}

export async function getTopContributors(): Promise<TopContributor[]> {
  // In a real app, this would query your database
  return topContributors
}

export async function getUserHistoricalData(userId: string): Promise<any | null> {
  // In a real app, this would query your database
  return userHistoricalData[userId] || null
}

export async function getTopRaters(limit = 5): Promise<LeaderboardEntry[]> {
  // In a real app, this would query your database for users with the most ratings
  // For now, we'll return the top entries from our mock leaderboard data
  return leaderboard.slice(0, limit)
}

