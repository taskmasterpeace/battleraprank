"use server"
import { supabase } from "./supabase"

// This service handles the storage and retrieval of mock data
// It ensures analytics components can access the generated data

interface MockDataOptions {
  ratingCount: number
  ratingVariance: number
  timeSpan: number
}

// First, let's check what tables actually exist in the database
async function getExistingTables() {
  try {
    // Query to get all tables in the public schema
    const { data, error } = await supabase.from("_tables").select("*")

    if (error) {
      console.error("Error fetching tables:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getExistingTables:", error)
    return []
  }
}

export async function generateMockData(options: MockDataOptions) {
  const { ratingCount, ratingVariance, timeSpan } = options

  try {
    // For now, let's create mock data that doesn't rely on specific table names
    const mockData = {
      topRatedBattlers: [
        { id: "1", name: "Loaded Lux", total_points: 9.2 },
        { id: "2", name: "Rum Nitty", total_points: 9.0 },
        { id: "3", name: "Geechi Gotti", total_points: 8.9 },
        { id: "4", name: "Tsu Surf", total_points: 8.7 },
        { id: "5", name: "JC", total_points: 8.5 },
        { id: "6", name: "K-Shine", total_points: 8.3 },
        { id: "7", name: "Hitman Holla", total_points: 8.2 },
        { id: "8", name: "Charlie Clips", total_points: 8.1 },
        { id: "9", name: "Daylyt", total_points: 8.0 },
        { id: "10", name: "T-Rex", total_points: 7.9 },
      ],
      categoryAverages: [
        { name: "Writing", average: 8.2 },
        { name: "Performance", average: 7.8 },
        { name: "Personal", average: 8.0 },
      ],
      trendData: [
        { month: "Jan", rating: 7.5 },
        { month: "Feb", rating: 7.8 },
        { month: "Mar", rating: 8.0 },
        { month: "Apr", rating: 8.2 },
        { month: "May", rating: 8.5 },
        { month: "Jun", rating: 8.3 },
        { month: "Jul", rating: 8.7 },
        { month: "Aug", rating: 8.9 },
        { month: "Sep", rating: 9.0 },
        { month: "Oct", rating: 9.2 },
      ],
    }

    // Store this mock data in localStorage or sessionStorage for the client component to access
    // Since we can't directly modify localStorage from a server component, we'll return the data
    // and let the client component handle storage

    return {
      success: true,
      message: "Generated mock analytics data",
      data: mockData,
    }
  } catch (error) {
    console.error("Error generating mock data:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function getAnalyticsData() {
  try {
    // Instead of querying non-existent tables, return hardcoded mock data
    return {
      topRatedBattlers: [
        { id: "1", name: "Loaded Lux", total_points: 9.2 },
        { id: "2", name: "Rum Nitty", total_points: 9.0 },
        { id: "3", name: "Geechi Gotti", total_points: 8.9 },
        { id: "4", name: "Tsu Surf", total_points: 8.7 },
        { id: "5", name: "JC", total_points: 8.5 },
        { id: "6", name: "K-Shine", total_points: 8.3 },
        { id: "7", name: "Hitman Holla", total_points: 8.2 },
        { id: "8", name: "Charlie Clips", total_points: 8.1 },
        { id: "9", name: "Daylyt", total_points: 8.0 },
        { id: "10", name: "T-Rex", total_points: 7.9 },
      ],
      categoryAverages: [
        { name: "Writing", average: 8.2 },
        { name: "Performance", average: 7.8 },
        { name: "Personal", average: 8.0 },
      ],
      trendData: [
        { month: "Jan", rating: 7.5 },
        { month: "Feb", rating: 7.8 },
        { month: "Mar", rating: 8.0 },
        { month: "Apr", rating: 8.2 },
        { month: "May", rating: 8.5 },
        { month: "Jun", rating: 8.3 },
        { month: "Jul", rating: 8.7 },
        { month: "Aug", rating: 8.9 },
        { month: "Sep", rating: 9.0 },
        { month: "Oct", rating: 9.2 },
      ],
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return {
      topRatedBattlers: [],
      categoryAverages: [],
      trendData: [],
    }
  }
}

// Function to generate mock data for testing - simplified version that doesn't rely on database tables
export async function generateMockAnalyticsData(count = 50) {
  try {
    // Instead of trying to insert into the database, just return success
    return {
      success: true,
      message: `Generated ${count} mock ratings (simulated)`,
    }
  } catch (error) {
    console.error("Error generating mock analytics data:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

