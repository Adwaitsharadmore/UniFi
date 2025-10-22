"use client"

import { useState } from "react"
import { MapPin, Users, Trophy, Flame } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { PublicUser } from "@/types/community"

interface PeopleCardProps {
  user: PublicUser
  onFollow?: (userId: string) => void
  onConnect?: (userId: string) => void
  onViewProfile?: (userId: string) => void
}

export default function PeopleCard({ 
  user, 
  onFollow, 
  onConnect, 
  onViewProfile 
}: PeopleCardProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false)
  const [isConnected, setIsConnected] = useState(user.isConnected || false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    onFollow?.(user.id)
  }

  const handleConnect = () => {
    setIsConnected(!isConnected)
    onConnect?.(user.id)
  }

  const formatXP = (xp: number) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`
    }
    return xp.toString()
  }

  const getLevelFromXP = (xp: number) => {
    if (xp < 500) return 1
    if (xp < 1000) return 2
    if (xp < 2000) return 3
    if (xp < 4000) return 4
    if (xp < 8000) return 5
    return 6
  }

  const level = getLevelFromXP(user.xp)
  const xpForNextLevel = level < 6 ? Math.pow(2, level) * 500 : 0
  const xpProgress = level < 6 ? ((user.xp % (Math.pow(2, level - 1) * 500)) / (Math.pow(2, level - 1) * 500)) * 100 : 100

  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback className="text-lg">
              {user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
            
            {user.headline && (
              <p className="text-sm mt-1 line-clamp-2">{user.headline}</p>
            )}
            
            {user.location && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {[user.location.city, user.location.region, user.location.country]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {user.badges.slice(0, 3).map((badge) => (
              <Badge key={badge.id} variant="outline" className="text-xs">
                {badge.icon} {badge.name}
              </Badge>
            ))}
            {user.badges.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.badges.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* XP and Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Level {level}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatXP(user.xp)} XP
            </div>
            {level < 6 && (
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-warning h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Streak */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">{user.streakDays} days</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Current streak
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-destructive h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((user.streakDays / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mutual Connections */}
        {user.mutualConnections && user.mutualConnections > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{user.mutualConnections} mutual connections</span>
          </div>
        )}

        {/* Titles */}
        {user.titles && user.titles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {user.titles.slice(0, 2).map((title, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {title}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={handleFollow}
            className="flex-1 transition-all duration-200 hover:scale-105"
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          
          <Button
            variant={isConnected ? "default" : "outline"}
            size="sm"
            onClick={handleConnect}
            className="flex-1 transition-all duration-200 hover:scale-105"
          >
            {isConnected ? "Connected" : "Connect"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
