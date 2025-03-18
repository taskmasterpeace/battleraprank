"use client"

import type { RoleWeight, UserRole } from "@/types/auth-types"

// Default weights for each role (same as in role-weight-service.ts)
export const DEFAULT_ROLE_WEIGHTS: RoleWeight[] = [
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

// Mock battler data
const MOCK_BATTLERS = [
  {
    id: "1",
    name: "Loaded Lux",
    image: "/placeholder.svg?height=300&width=300&text=Loaded+Lux",
    location: "Harlem, NY",
  },
  {
    id: "2",
    name: "Murda Mook",
    image: "/placeholder.svg?height=300&width=300&text=Murda+Mook",
    location: "Harlem, NY",
  },
  {
    id: "3",
    name: "Geechi Gotti",
    image: "/placeholder.svg?height=300&width=300&text=Geechi+Gotti",
    location: "Compton, CA",
  },
  {
    id: "4",
    name: "Rum Nitty",
    image: "/placeholder.svg?height=300&width=300&text=Rum+Nitty",
    location: "Phoenix, AZ",
  },
  {
    id: "5",
    name: "Tay Roc",
    image: "/placeholder.svg?height=300&width=300&text=Tay+Roc",
    location: "Baltimore, MD",
  },
  {
    id: "6",
    name: "Hitman Holla",
    image: "/placeholder.svg?height=300&width=300&text=Hitman+Holla",
    location: "St. Louis, MO",
  },
  {
    id: "7",
    name: "K-Shine",
    image: "/placeholder.svg?height=300&width=300&text=K-Shine",
    location: "Harlem, NY",
  },
  {
    id: "8",
    name: "Charlie Clips",
    image: "/placeholder.svg?height=300&width=300&text=Charlie+Clips",
    location: "Harlem, NY",
  },
  {
    id: "9",
    name: "Aye Verb",
    image: "/placeholder.svg?height=300&width=300&text=Aye+Verb",
    location: "St. Louis, MO",
  },
  {
    id: "10",
    name: "JC",
    image: "/placeholder.svg?height=300&width=300&text=JC",
    location: "Pontiac, MI",
  },
]

// Generate mock ratings for each battler
function generateMockRatings() {
  const categories = ["Writing", "Performance", "Personal"]
  const attributes = {
    Writing: ["Wordplay", "Punchlines", "Schemes", "Angles"],
    Performance: ["Delivery", "Stage Presence", "Crowd Control", "Showmanship"],
    Personal: ["Authenticity", "Battle IQ", "Preparation", "Consistency"],
  }

  const mockData = []

  for (const battler of MOCK_BATTLERS) {
    for (const category of categories) {
      for (const attribute of attributes[category as keyof typeof attributes]) {
        // Generate different ratings for each role
        const fanAverage = Math.random() * 3 + 7 // 7-10 range
        const mediaAverage = Math.random() * 3 + 7
        const battlerAverage = Math.random() * 3 + 7
        const leagueOwnerAverage = Math.random() * 3 + 7

        // Calculate weighted average
        const overallAverage =
          (fanAverage * 1.0 + mediaAverage * 2.0 + battlerAverage * 2.5 + leagueOwnerAverage * 3.0) / 8.5

        mockData.push({
          battlerId: battler.id,
          category,
          attribute,
          overallAverage,
          fanAverage,
          mediaAverage,
          battlerAverage,
          leagueOwnerAverage,
          updatedAt: new Date().toISOString(),
        })
      }
    }
  }

  return mockData
}

// Client-side mock data functions
export function getMockRoleWeights(): RoleWeight[] {
  // Try to get from localStorage first
  const storedWeights = localStorage.getItem("mockRoleWeights")
  if (storedWeights) {
    try {
      return JSON.parse(storedWeights)
    } catch (e) {
      console.error("Error parsing stored role weights:", e)
    }
  }

  // Return defaults if nothing in localStorage
  return DEFAULT_ROLE_WEIGHTS
}

export function updateMockRoleWeight(role: UserRole, weight: number): { success: boolean; error?: any } {
  try {
    const weights = getMockRoleWeights()
    const updatedWeights = weights.map((rw) => (rw.role === role ? { ...rw, weight } : rw))

    localStorage.setItem("mockRoleWeights", JSON.stringify(updatedWeights))
    return { success: true }
  } catch (e) {
    console.error(`Error updating weight for role ${role}:`, e)
    return { success: false, error: e }
  }
}

export function resetMockRoleWeightsToDefault(): { success: boolean; error?: any } {
  try {
    localStorage.setItem("mockRoleWeights", JSON.stringify(DEFAULT_ROLE_WEIGHTS))
    return { success: true }
  } catch (e) {
    console.error("Error resetting role weights:", e)
    return { success: false, error: e }
  }
}

export function getMockBattlerAttributeAverages(battlerId: string, category?: string): any[] {
  // Try to get from localStorage first
  const storedData = localStorage.getItem("mockBattlerAttributes")
  let mockData = []

  if (storedData) {
    try {
      mockData = JSON.parse(storedData)
    } catch (e) {
      console.error("Error parsing stored battler attributes:", e)
      mockData = generateMockRatings()
      localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData))
    }
  } else {
    mockData = generateMockRatings()
    localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData))
  }

  // Filter by battlerId and optionally by category
  return mockData.filter((item: any) => {
    if (category) {
      return item.battlerId === battlerId && item.category === category
    }
    return item.battlerId === battlerId
  })
}

export function getMockTopBattlersByRole(role: UserRole, category?: string, attribute?: string, limit = 10): any[] {
  // Try to get from localStorage first
  const storedData = localStorage.getItem("mockBattlerAttributes")
  let mockData = []

  if (storedData) {
    try {
      mockData = JSON.parse(storedData)
    } catch (e) {
      console.error("Error parsing stored battler attributes:", e)
      mockData = generateMockRatings()
      localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData))
    }
  } else {
    mockData = generateMockRatings()
    localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData))
  }

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

  // Filter by category and attribute if provided
  let filteredData = mockData
  if (category) {
    filteredData = filteredData.filter((item: any) => item.category === category)
  }
  if (attribute) {
    filteredData = filteredData.filter((item: any) => item.attribute === attribute)
  }

  // Sort by the selected average column
  filteredData.sort((a: any, b: any) => b[averageColumn] - a[averageColumn])

  // Limit the results
  filteredData = filteredData.slice(0, limit)

  // Join with battler data
  return filteredData.map((item: any) => {
    const battler = MOCK_BATTLERS.find((b) => b.id === item.battlerId)
    return {
      ...item,
      battlerName: battler?.name || "Unknown",
      battlerImage: battler?.image || "",
      battlerLocation: battler?.location || "",
      rating: item[averageColumn],
    }
  })
}

// Function to regenerate all mock analytics data
export function regenerateMockAnalyticsData(): { success: boolean; error?: any } {
  try {
    const mockData = generateMockRatings()
    localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData))
    return { success: true }
  } catch (e) {
    console.error("Error generating mock analytics data:", e)
    return { success: false, error: e }
  }
}

