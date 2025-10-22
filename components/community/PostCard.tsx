"use client"

import { useState } from "react"
import { Heart, MessageCircle, Repeat2, MoreHorizontal, MapPin, Target, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import ProgressRingMini from "./ProgressRingMini"
import type { ProgressPost, PublicUser, PublicGoal } from "@/types/community"

interface PostCardProps {
  post: ProgressPost & { user?: PublicUser; goal?: PublicGoal }
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onRepost?: (postId: string) => void
  onShare?: (postId: string) => void
}

export default function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onRepost, 
  onShare 
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(post.likedByMe || false)
  const [isReposted, setIsReposted] = useState(post.repostedByMe || false)
  const [likeCount, setLikeCount] = useState(post.metrics.likes)
  const [repostCount, setRepostCount] = useState(post.metrics.reposts)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯'
      case 'celebration': return '🎉'
      case 'tip': return '💡'
      case 'update': return '📊'
      default: return '📝'
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-primary text-primary-foreground'
      case 'celebration': return 'bg-success text-success-foreground'
      case 'tip': return 'bg-warning text-warning-foreground'
      case 'update': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post.id)
  }

  const handleRepost = () => {
    setIsReposted(!isReposted)
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1)
    onRepost?.(post.id)
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 group border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start gap-3 p-6 pb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.user?.avatarUrl} alt={post.user?.fullName} />
            <AvatarFallback>
              {post.user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{post.user?.fullName}</h4>
              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                {getPostTypeIcon(post.type)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>@{post.user?.username}</span>
              {post.user?.headline && (
                <>
                  <span>•</span>
                  <span className="truncate">{post.user.headline}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.user?.location?.city && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{post.user.location.city}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Engagement Stats (if high engagement) */}
        {(post.metrics.likes > 10 || post.metrics.comments > 5 || post.metrics.reposts > 3) && (
          <div className="px-6 pb-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {post.metrics.likes > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <Heart className="h-2.5 w-2.5 text-primary fill-current" />
                  </div>
                  <span>{post.metrics.likes}</span>
                </div>
              )}
              {post.metrics.comments > 0 && (
                <div className="flex items-center gap-1">
                  <span>{post.metrics.comments} comment{post.metrics.comments !== 1 ? 's' : ''}</span>
                </div>
              )}
              {post.metrics.reposts > 0 && (
                <div className="flex items-center gap-1">
                  <span>{post.metrics.reposts} repost{post.metrics.reposts !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-4">
          <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
        </div>

        {/* Goal Progress (if available) */}
        {post.goal && (
          <div className="mx-6 mb-4 bg-muted/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <ProgressRingMini 
                current={post.goal.currentAmountCents} 
                target={post.goal.targetAmountCents}
                size={48}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{post.goal.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {post.goal.category}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(post.goal.currentAmountCents)} of {formatCurrency(post.goal.targetAmountCents)}
                  {post.goal.successProbability && (
                    <span className="ml-2">
                      • {post.goal.successProbability}% success probability
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media (if available) */}
        {post.mediaUrl && (
          <div className="px-6 mb-4">
            <img 
              src={post.mediaUrl} 
              alt="Post media" 
              className="rounded-lg w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "h-9 px-3 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-full",
                  isLiked && "text-destructive bg-destructive/10"
                )}
              >
                <Heart className={cn("h-4 w-4 transition-all duration-200", isLiked && "fill-current scale-110")} />
                <span className="text-sm font-medium transition-all duration-200">{likeCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="h-9 px-3 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-full"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{post.metrics.comments}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepost}
                className={cn(
                  "h-9 px-3 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-full",
                  isReposted && "text-primary bg-primary/10"
                )}
              >
                <Repeat2 className="h-4 w-4" />
                <span className="text-sm font-medium">{repostCount}</span>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 rounded-full"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comments Section (placeholder) */}
        {showComments && (
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
            <div className="text-sm text-muted-foreground text-center py-4">
              Comments feature coming soon...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
