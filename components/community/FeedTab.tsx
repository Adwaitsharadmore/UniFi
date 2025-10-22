"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PostCard from "./PostCard"
import PostCardSkeleton from "./PostCardSkeleton"
import type { ProgressPost, PublicUser, PublicGoal, CommunityFilters } from "@/types/community"

interface FeedTabProps {
  filters: CommunityFilters
}

export default function FeedTab({ filters }: FeedTabProps) {
  const searchParams = useSearchParams()
  const [allPosts, setAllPosts] = useState<(ProgressPost & { user?: PublicUser; goal?: PublicGoal })[]>([])
  const [filteredPosts, setFilteredPosts] = useState<(ProgressPost & { user?: PublicUser; goal?: PublicGoal })[]>([])
  const [users, setUsers] = useState<PublicUser[]>([])
  const [goals, setGoals] = useState<PublicGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showComposer, setShowComposer] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedGoalId, setSelectedGoalId] = useState<string>("")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Check for share parameter from Goals page
    const shareText = searchParams.get('share')
    if (shareText) {
      setNewPostContent(decodeURIComponent(shareText))
      setShowComposer(true)
    }
  }, [searchParams])

  useEffect(() => {
    // Apply filters to posts
    if (allPosts.length > 0) {
      applyFilters()
    }
  }, [filters, allPosts])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load users, goals, and posts
      const [usersResponse, goalsResponse, postsResponse] = await Promise.all([
        fetch('/data/community/users.json'),
        fetch('/data/community/goals.json'),
        fetch('/data/community/posts.json')
      ])

      const usersData = await usersResponse.json()
      const goalsData = await goalsResponse.json()
      const postsData = await postsResponse.json()

      setUsers(usersData)
      setGoals(goalsData)

      // Enrich posts with user and goal data
      const enrichedPosts = postsData.map((post: ProgressPost) => ({
        ...post,
        user: usersData.find((u: PublicUser) => u.id === post.userId),
        goal: post.goalId ? goalsData.find((g: PublicGoal) => g.id === post.goalId) : undefined
      }))

      setAllPosts(enrichedPosts)
      setFilteredPosts(enrichedPosts)
    } catch (error) {
      console.error('Error loading community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    // This would apply search, category, location, and sort filters
    // For now, we'll just sort by the selected sort option
    let filtered = [...allPosts]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchLower) ||
        post.user?.fullName.toLowerCase().includes(searchLower) ||
        post.user?.username.toLowerCase().includes(searchLower) ||
        post.goal?.name.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(post => 
        post.goal && filters.category!.includes(post.goal.category)
      )
    }

    // Sort posts
    switch (filters.sortBy) {
      case 'trending':
        filtered.sort((a, b) => {
          const scoreA = a.metrics.likes * 3 + a.metrics.comments * 5 + a.metrics.reposts * 7
          const scoreB = b.metrics.likes * 3 + b.metrics.comments * 5 + b.metrics.reposts * 7
          return scoreB - scoreA
        })
        break
      case 'nearby':
        // For now, just sort by newest since we don't have location matching logic
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredPosts(filtered)
  }

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return

    const newPost: ProgressPost & { user?: PublicUser; goal?: PublicGoal } = {
      id: `post_${Date.now()}`,
      userId: 'current_user', // This would be the actual current user ID
      goalId: selectedGoalId || undefined,
      createdAt: new Date().toISOString(),
      type: 'update',
      content: newPostContent,
      metrics: {
        likes: 0,
        comments: 0,
        reposts: 0
      },
      likedByMe: false,
      repostedByMe: false,
      user: {
        id: 'current_user',
        username: 'you',
        fullName: 'You',
        avatarUrl: '/avatars/user_krimson.png',
        badges: [],
        xp: 0,
        streakDays: 0
      },
      goal: selectedGoalId ? goals.find(g => g.id === selectedGoalId) : undefined
    }

    setAllPosts(prev => [newPost, ...prev])
    setFilteredPosts(prev => [newPost, ...prev])
    setNewPostContent("")
    setSelectedGoalId("")
    setShowComposer(false)
  }

  const handleLike = (postId: string) => {
    // In a real app, this would make an API call
    console.log('Liked post:', postId)
  }

  const handleComment = (postId: string) => {
    // In a real app, this would open a comment modal
    console.log('Comment on post:', postId)
  }

  const handleRepost = (postId: string) => {
    // In a real app, this would make an API call
    console.log('Reposted post:', postId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Post Composer Skeleton */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="flex-1 h-12 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Posts Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Post Composer */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatars/user_krimson.png" alt="You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Dialog open={showComposer} onOpenChange={setShowComposer}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-muted-foreground h-12 px-4 text-left font-normal border-border/50 hover:bg-muted/50"
                  >
                    Share your progress...
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/user_krimson.png" alt="You" />
                        <AvatarFallback>Y</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Share your progress</h3>
                        <p className="text-sm text-muted-foreground">What milestone did you reach?</p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What milestone did you reach? What tip do you have? Share your financial journey..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-32 border-0 resize-none text-base"
                    />
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Link to a goal (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {goals.filter(g => g.isPublic).map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.name} ({goal.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={handlePostSubmit} 
                        disabled={!newPostContent.trim()}
                        className="px-6"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No posts found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onRepost={handleRepost}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  )
}
