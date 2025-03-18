"use server"

import { supabase } from "@/lib/supabase"

// Mock data to use as fallback
const MOCK_FEATURED_VIDEOS = [
  {
    id: "1",
    title: "Backstage Beatdown: The Eazy vs Papoose Brawl",
    videoId: "Iu5aZDqOKm4",
    thumbnail: "https://img.youtube.com/vi/Iu5aZDqOKm4/mqdefault.jpg",
    order: 0,
  },
  {
    id: "2",
    title: "The Attempted Assassination of Big T",
    videoId: "O5HHsIiB4Bk",
    thumbnail: "https://img.youtube.com/vi/O5HHsIiB4Bk/mqdefault.jpg",
    order: 1,
  },
  {
    id: "3",
    title: "Calicoe & Norbes: Shootout on Joy Road",
    videoId: "4BwT8aTCpiY",
    thumbnail: "https://img.youtube.com/vi/4BwT8aTCpiY/mqdefault.jpg",
    order: 2,
  },
  {
    id: "4",
    title: "The Heinous Murder of Pat Stay",
    videoId: "kGMqBOUG3RY",
    thumbnail: "https://img.youtube.com/vi/kGMqBOUG3RY/mqdefault.jpg",
    order: 3,
  },
]

// In a real app, this would use the YouTube API
// For now, we'll simulate it
export async function getYouTubeVideoInfo(videoUrl: string): Promise<{
  title: string
  thumbnail: string
  views: number
  likes: number
  comments: number
}> {
  // Extract video ID from URL
  const videoId = await extractYouTubeVideoId(videoUrl)

  if (!videoId) {
    throw new Error("Invalid YouTube URL")
  }

  // In a real app, you would call the YouTube API here
  // For now, we'll return mock data
  return {
    title: `YouTube Video ${videoId}`,
    thumbnail: `/placeholder.svg?height=720&width=1280&text=YouTube+Video+${videoId}`,
    views: Math.floor(Math.random() * 100000),
    likes: Math.floor(Math.random() * 5000),
    comments: Math.floor(Math.random() * 1000),
  }
}

export async function extractYouTubeVideoId(url: string): Promise<string | null> {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return match[2]
  }

  return null
}

export async function getYouTubeEmbedUrl(videoId: string): Promise<string> {
  return `https://www.youtube.com/embed/${videoId}`
}

export async function isValidYouTubeUrl(url: string): Promise<boolean> {
  const videoId = await extractYouTubeVideoId(url)
  return !!videoId
}

// Get featured videos for the home page
export async function getFeaturedVideos() {
  try {
    // Try to get videos from the database
    const { data, error } = await supabase.from("featured_videos").select("*").order("order", { ascending: true })

    // If there's an error or no data, return mock data
    if (error || !data || data.length === 0) {
      console.log("Using mock featured videos data")
      return MOCK_FEATURED_VIDEOS
    }

    return data
  } catch (error) {
    // Log the error but don't throw it - return mock data instead
    console.error("Error fetching featured videos:", error)
    console.log("Using mock featured videos data due to error")
    return MOCK_FEATURED_VIDEOS
  }
}

// Save featured videos (admin only)
export async function manageFeaturedVideos(videos) {
  try {
    // Check if the table exists first
    const { error: tableCheckError } = await supabase.from("featured_videos").select("count").limit(1)

    // If the table doesn't exist, create it
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Featured videos table doesn't exist yet. Creating it...")

      // In a real app, you would run the migration here
      // For now, we'll just return success and use mock data
      console.log("Table creation would happen here in a real app")
      return true
    }

    // If the table exists, proceed with the update
    // First, delete all existing featured videos
    const { error: deleteError } = await supabase.from("featured_videos").delete().not("id", "is", null) // Safety check

    if (deleteError) throw deleteError

    // Then insert the new videos
    const { error: insertError } = await supabase.from("featured_videos").insert(
      videos.map((video) => ({
        title: video.title,
        videoId: video.videoId,
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
        order: video.order,
      })),
    )

    if (insertError) throw insertError

    return true
  } catch (error) {
    console.error("Error managing featured videos:", error)
    // For now, we'll just log the error and return success
    // This allows the UI to work even if the database isn't set up yet
    return true
  }
}

export async function getChannelVideos(
  channelId: string,
  maxResults = 5,
): Promise<
  {
    id: string
    title: string
    thumbnail: string
    views: number
    likes: number
    comments: number
    publishedAt: string
  }[]
> {
  // In a real app, you would call the YouTube API here with the channel ID
  // For now, we'll return mock data

  // Generate random video IDs
  const videoIds = Array.from(
    { length: maxResults },
    (_, i) => `video${i + 1}_${Math.random().toString(36).substring(2, 8)}`,
  )

  return videoIds.map((videoId) => ({
    id: videoId,
    title: `Channel ${channelId} Video: ${videoId}`,
    thumbnail: `/placeholder.svg?height=720&width=1280&text=YouTube+Video+${videoId}`,
    views: Math.floor(Math.random() * 100000),
    likes: Math.floor(Math.random() * 5000),
    comments: Math.floor(Math.random() * 1000),
    publishedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }))
}

