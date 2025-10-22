"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { PublicUser, LeaderboardEntry, CommunityFilters } from "@/types/community"

interface LeaderboardTabProps {
  filters: CommunityFilters
}

const METRIC_OPTIONS = [
  { value: 'xp', label: 'XP' },
  { value: 'streak', label: 'Streak' },
  { value: 'progress', label: 'Progress' },
  { value: 'goals_achieved', label: 'Goals Achieved' }
]

const SCOPE_OPTIONS = [
  { value: 'global', label: 'Global' },
  { value: 'region', label: 'My Region' },
  { value: 'category', label: 'My Category' }
]

export default function LeaderboardTab({ filters }: LeaderboardTabProps) {
  const [users, setUsers] = useState<PublicUser[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState('xp')
  const [selectedScope, setSelectedScope] = useState('global')

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      generateLeaderboard()
    }
  }, [users, selectedMetric, selectedScope])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/data/community/users.json')
      const usersData = await response.json()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateLeaderboard = () => {
    if (!users.length) return

    let filteredUsers = [...users]

    // Apply scope filter
    if (selectedScope === 'region') {
      // In a real app, you'd filter by user's region
      // For now, we'll just use all users
    } else if (selectedScope === 'category') {
      // In a real app, you'd filter by user's goal categories
      // For now, we'll just use all users
    }

    // Generate leaderboard entries
    const entries: LeaderboardEntry[] = filteredUsers.map((user, index) => {
      let value = 0
      let score = 0

      switch (selectedMetric) {
        case 'xp':
          value = user.xp
          score = user.xp
          break
        case 'streak':
          value = user.streakDays
          score = user.streakDays * 10 // Weight streak days
          break
        case 'progress':
          // Mock progress calculation (in real app, this would be based on actual goal progress)
          value = Math.floor(Math.random() * 100)
          score = value
          break
        case 'goals_achieved':
          // Mock goals achieved (in real app, this would be based on actual completed goals)
          value = Math.floor(Math.random() * 10)
          score = value * 100
          break
      }

      return {
        user,
        rank: index + 1,
        score,
        metric: selectedMetric as 'xp' | 'streak' | 'progress' | 'goals_achieved',
        value,
        change: Math.floor(Math.random() * 21) - 10 // Mock rank change
      }
    })

    // Sort by score
    entries.sort((a, b) => b.score - a.score)

    // Update ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    setLeaderboard(entries)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-mono text-muted-foreground">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-card border"
    }
  }

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'xp':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
      case 'streak':
        return `${value} days`
      case 'progress':
        return `${value}%`
      case 'goals_achieved':
        return value.toString()
      default:
        return value.toString()
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-destructive" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const topThree = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2">
          {SCOPE_OPTIONS.map((scope) => (
            <Button
              key={scope.value}
              variant={selectedScope === scope.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedScope(scope.value)}
            >
              {scope.label}
            </Button>
          ))}
        </div>
        
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {METRIC_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {topThree.map((entry, index) => (
            <Card key={entry.user.id} className={cn("relative overflow-hidden", getRankColor(entry.rank))}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={entry.user.avatarUrl} alt={entry.user.fullName} />
                  <AvatarFallback className="text-lg">
                    {entry.user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="font-medium text-lg mb-1">{entry.user.fullName}</h3>
                <p className="text-sm opacity-80 mb-2">@{entry.user.username}</p>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatValue(entry.value, entry.metric)}
                  </div>
                  <div className="text-sm opacity-80">
                    {entry.metric === 'xp' ? 'XP' : 
                     entry.metric === 'streak' ? 'Streak' :
                     entry.metric === 'progress' ? 'Progress' : 'Goals'}
                  </div>
                </div>

                {entry.change !== 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                    {getChangeIcon(entry.change || 0)}
                    <span>{Math.abs(entry.change || 0)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rest of Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Full Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {rest.map((entry) => (
              <div
                key={entry.user.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.user.avatarUrl} alt={entry.user.fullName} />
                    <AvatarFallback>
                      {entry.user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{entry.user.fullName}</h4>
                    <p className="text-sm text-muted-foreground truncate">@{entry.user.username}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono font-medium">
                    {formatValue(entry.value, entry.metric)}
                  </div>
                  {entry.change !== 0 && (
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      {getChangeIcon(entry.change || 0)}
                      <span>{Math.abs(entry.change || 0)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Challenges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Save $100 This Week</h4>
                <p className="text-sm text-muted-foreground">Earn 200 XP + Badge</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">$65 / $100 saved</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">7-Day Streak</h4>
                <p className="text-sm text-muted-foreground">Earn 150 XP</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">7 / 7 days completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
