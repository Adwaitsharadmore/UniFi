"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, Flame, TrendingUp } from "lucide-react"
import type { WeeklyLeaderboard as WeeklyLeaderboardType } from "@/types/learning"

interface WeeklyLeaderboardProps {
  leaderboard: WeeklyLeaderboardType | null
}

export function WeeklyLeaderboard({ leaderboard }: WeeklyLeaderboardProps) {
  const [activeTab, setActiveTab] = useState("global")

  if (!leaderboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Leaderboard Data</h2>
          <p className="text-muted-foreground">
            Complete some lessons to see the leaderboard.
          </p>
        </div>
      </div>
    )
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600 fill-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankClassName = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-500/30"
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "bg-gradient-to-r from-amber-400/20 to-amber-600/20 border-amber-500/30"
      default:
        return "bg-card border-border"
    }
  }

  const getRegionEntries = (region: string) => {
    return leaderboard.entries.filter(entry => entry.region === region)
  }

  const getFollowingEntries = () => {
    // Mock following data - in real app, this would come from user's following list
    return leaderboard.entries.slice(0, 5)
  }

  const renderLeaderboard = (entries: any[]) => {
    if (entries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No entries for this category</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "transition-all duration-200 hover:shadow-md",
              getRankClassName(entry.rank)
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback>
                        {entry.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-semibold">{entry.name}</p>
                      {entry.region && (
                        <p className="text-sm text-muted-foreground">{entry.region}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-bold text-lg">{entry.xp.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">{entry.streak}</span>
                        <span className="text-xs text-muted-foreground">day streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Weekly Leaderboard</h2>
        <p className="text-muted-foreground">
          Week of {new Date(leaderboard.week).toLocaleDateString()}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="region">My Region</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Global Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(leaderboard.entries)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="region" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Regional Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(getRegionEntries("North America"))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Following Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(getFollowingEntries())}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Your Position */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10">
                <span className="text-lg font-bold text-primary">#?</span>
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/user_krimson.png" alt="You" />
                <AvatarFallback>YOU</AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-semibold">You</p>
                <p className="text-sm text-muted-foreground">Complete lessons to rank up!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-bold text-lg">0</span>
                  <span className="text-sm text-muted-foreground">XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">0</span>
                  <span className="text-xs text-muted-foreground">day streak</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
