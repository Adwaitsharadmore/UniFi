"use client"

import { useEffect, useState } from "react"
import { Loader2, Users, MapPin, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import PeopleCard from "./PeopleCard"
import PeopleCardSkeleton from "./PeopleCardSkeleton"
import type { PublicUser, CommunityFilters, GoalCategory } from "@/types/community"

interface DirectoryTabProps {
  filters: CommunityFilters
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'xp', label: 'XP' },
  { value: 'streak', label: 'Streak' },
  { value: 'newest', label: 'Newest' }
]

export default function DirectoryTab({ filters }: DirectoryTabProps) {
  const [allUsers, setAllUsers] = useState<PublicUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (allUsers.length > 0) {
      applyFilters()
    }
  }, [filters, allUsers, searchQuery, sortBy])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/data/community/users.json')
      const usersData = await response.json()
      setAllUsers(usersData)
      setFilteredUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allUsers]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.headline?.toLowerCase().includes(query) ||
        user.location?.city?.toLowerCase().includes(query) ||
        user.location?.region?.toLowerCase().includes(query) ||
        user.location?.country?.toLowerCase().includes(query)
      )
    }

    // Apply category filter (if user has goals in those categories)
    if (filters.category && filters.category.length > 0) {
      // For now, we'll just show all users since we don't have goal data linked
      // In a real app, you'd filter based on user's public goals
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(user => {
        if (filters.location?.country && user.location?.country !== filters.location.country) {
          return false
        }
        if (filters.location?.region && user.location?.region !== filters.location.region) {
          return false
        }
        if (filters.location?.city && user.location?.city !== filters.location.city) {
          return false
        }
        return true
      })
    }

    // Sort users
    switch (sortBy) {
      case 'xp':
        filtered.sort((a, b) => b.xp - a.xp)
        break
      case 'streak':
        filtered.sort((a, b) => b.streakDays - a.streakDays)
        break
      case 'newest':
        // Since we don't have join dates, we'll sort by XP as a proxy
        filtered.sort((a, b) => b.xp - a.xp)
        break
      case 'relevance':
      default:
        // Sort by relevance (search match + mutual connections + XP)
        filtered.sort((a, b) => {
          let scoreA = a.xp / 1000 // Base score from XP
          let scoreB = b.xp / 1000

          // Boost score for mutual connections
          if (a.mutualConnections) scoreA += a.mutualConnections * 10
          if (b.mutualConnections) scoreB += b.mutualConnections * 10

          // Boost score for search matches
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            if (a.fullName.toLowerCase().includes(query)) scoreA += 50
            if (a.username.toLowerCase().includes(query)) scoreA += 30
            if (a.headline?.toLowerCase().includes(query)) scoreA += 20
            
            if (b.fullName.toLowerCase().includes(query)) scoreB += 50
            if (b.username.toLowerCase().includes(query)) scoreB += 30
            if (b.headline?.toLowerCase().includes(query)) scoreB += 20
          }

          return scoreB - scoreA
        })
        break
    }

    setFilteredUsers(filtered)
  }

  const handleFollow = (userId: string) => {
    // In a real app, this would make an API call
    console.log('Follow user:', userId)
  }

  const handleConnect = (userId: string) => {
    // In a real app, this would make an API call
    console.log('Connect with user:', userId)
  }

  const handleViewProfile = (userId: string) => {
    // In a real app, this would navigate to user profile
    console.log('View profile:', userId)
  }

  const getStats = () => {
    const totalUsers = allUsers.length
    const activeUsers = allUsers.filter(u => u.streakDays > 0).length
    const topCategories = ['Home', 'Emergency', 'Travel', 'Debt', 'Car'] // Mock data

    return { totalUsers, activeUsers, topCategories }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg w-10 h-10" />
                  <div className="space-y-2">
                    <div className="h-6 w-16 bg-muted rounded" />
                    <div className="h-4 w-20 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-muted rounded" />
          <div className="w-40 h-10 bg-muted rounded" />
        </div>

        {/* People Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PeopleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Directory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Trophy className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <MapPin className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search people by name, location, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Goal Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.topCategories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-accent">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* People Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No people found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <PeopleCard
              key={user.id}
              user={user}
              onFollow={handleFollow}
              onConnect={handleConnect}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredUsers.length > 0 && (
        <div className="text-center">
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Load more people
          </button>
        </div>
      )}
    </div>
  )
}
