"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "@/components/ui/chart"
import RoleBasedAnalytics from "@/components/analytics/RoleBasedAnalytics"

// Default mock data if nothing is in localStorage
const defaultMockData = {
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

export default function AnalyticsPage() {
  // Move all hooks inside the component function
  const [selectedBattler, setSelectedBattler] = useState("1")
  const [analyticsData, setAnalyticsData] = useState(defaultMockData)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for battlers
  const battlers = [
    { id: "1", name: "Loaded Lux" },
    { id: "2", name: "Tsu Surf" },
    { id: "3", name: "Geechi Gotti" },
    { id: "4", name: "Rum Nitty" },
    { id: "5", name: "JC" },
    { id: "6", name: "K-Shine" },
  ]

  useEffect(() => {
    // Function to load data from localStorage
    function loadMockData() {
      setIsLoading(true)
      try {
        // Check if we have mock data in localStorage
        if (typeof window !== "undefined") {
          const storedData = localStorage.getItem("mockAnalyticsData")

          if (storedData) {
            console.log("Found mock data in localStorage")
            setAnalyticsData(JSON.parse(storedData))
          } else {
            console.log("No mock data found in localStorage, using default data")
            setAnalyticsData(defaultMockData)
          }
        }
      } catch (error) {
        console.error("Error loading mock data:", error)
        setAnalyticsData(defaultMockData)
      } finally {
        setIsLoading(false)
      }
    }

    loadMockData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8 bg-gray-900 border border-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="role-based">Role-Based</TabsTrigger>
          <TabsTrigger value="battler">Battler Analysis</TabsTrigger>
          <TabsTrigger value="community">Community Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Rated Battlers</CardTitle>
                <CardDescription>Overall ratings across all categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p>Loading data...</p>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analyticsData.topRatedBattlers.map((b) => ({ name: b.name, rating: b.total_points }))}
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="rating" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Averages</CardTitle>
                <CardDescription>Average ratings by category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p>Loading data...</p>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.categoryAverages}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="average" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Trends</CardTitle>
                <CardDescription>Average ratings over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p>Loading data...</p>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[7, 10]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="role-based">
          <RoleBasedAnalytics />
        </TabsContent>

        <TabsContent value="battler">
          <div className="mb-6 flex justify-end">
            <Select value={selectedBattler} onValueChange={setSelectedBattler}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select battler" />
              </SelectTrigger>
              <SelectContent>
                {battlers.map((battler) => (
                  <SelectItem key={battler.id} value={battler.id}>
                    {battler.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Attribute Breakdown</CardTitle>
                <CardDescription>Detailed ratings for each attribute</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Wordplay", rating: 8.5 },
                        { name: "Punchlines", rating: 7.2 },
                        { name: "Schemes", rating: 9.0 },
                        { name: "Angles", rating: 8.8 },
                        { name: "Delivery", rating: 7.5 },
                        { name: "Stage Presence", rating: 8.0 },
                        { name: "Crowd Control", rating: 7.8 },
                        { name: "Showmanship", rating: 7.2 },
                        { name: "Authenticity", rating: 9.2 },
                        { name: "Battle IQ", rating: 9.5 },
                        { name: "Preparation", rating: 9.0 },
                        { name: "Consistency", rating: 8.0 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="rating" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Common Positive Badges</CardTitle>
                <CardDescription>Badges most frequently assigned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: "Wordsmith", count: 85 },
                        { name: "Pen Game", count: 72 },
                        { name: "Battle IQ", count: 68 },
                        { name: "Consistent", count: 55 },
                        { name: "Versatile", count: 42 },
                      ]}
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Common Negative Badges</CardTitle>
                <CardDescription>Badges most frequently assigned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: "Inconsistent", count: 45 },
                        { name: "Predictable", count: 38 },
                        { name: "Chokes", count: 32 },
                        { name: "One-Dimensional", count: 28 },
                        { name: "Low Energy", count: 25 },
                      ]}
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Community Rating Distribution</CardTitle>
                <CardDescription>How the community rates battlers overall</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { rating: "0-1", count: 5 },
                        { rating: "1-2", count: 12 },
                        { rating: "2-3", count: 25 },
                        { rating: "3-4", count: 38 },
                        { rating: "4-5", count: 65 },
                        { rating: "5-6", count: 120 },
                        { rating: "6-7", count: 180 },
                        { rating: "7-8", count: 210 },
                        { rating: "8-9", count: 145 },
                        { rating: "9-10", count: 75 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Valued Attributes</CardTitle>
                <CardDescription>Attributes with highest average ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: "Battle IQ", average: 8.9 },
                        { name: "Wordplay", average: 8.7 },
                        { name: "Punchlines", average: 8.5 },
                        { name: "Authenticity", average: 8.3 },
                        { name: "Delivery", average: 8.1 },
                      ]}
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 10]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Trends Over Time</CardTitle>
                <CardDescription>How community ratings have changed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", writing: 7.5, performance: 7.2, personal: 7.8 },
                        { month: "Feb", writing: 7.7, performance: 7.3, personal: 7.9 },
                        { month: "Mar", writing: 7.9, performance: 7.5, personal: 8.0 },
                        { month: "Apr", writing: 8.1, performance: 7.7, personal: 8.2 },
                        { month: "May", writing: 8.3, performance: 7.9, personal: 8.4 },
                        { month: "Jun", writing: 8.2, performance: 8.0, personal: 8.3 },
                        { month: "Jul", writing: 8.4, performance: 8.2, personal: 8.5 },
                        { month: "Aug", writing: 8.6, performance: 8.3, personal: 8.7 },
                        { month: "Sep", writing: 8.7, performance: 8.4, personal: 8.8 },
                        { month: "Oct", writing: 8.9, performance: 8.6, personal: 9.0 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[7, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="writing" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="personal" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

