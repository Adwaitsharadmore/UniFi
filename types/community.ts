// Community Types
export type GoalCategory = 'Home' | 'Emergency' | 'Car' | 'Tuition' | 'Debt' | 'Travel' | 'Business' | 'Retirement' | 'Other'

export interface PublicUser {
  id: string
  username: string // unique handle
  fullName: string
  avatarUrl?: string
  location?: {
    city?: string
    region?: string
    country?: string
  }
  headline?: string // "Saving for…", "Debt-free in 8 months", etc.
  badges: {
    id: string
    name: string
    icon: string
  }[]
  xp: number
  streakDays: number
  titles?: string[] // e.g., "Budget Knight"
  isFollowing?: boolean
  isConnected?: boolean
  mutualConnections?: number
}

export interface PublicGoal {
  id: string
  userId: string
  name: string // "Home Down Payment"
  category: GoalCategory
  targetAmountCents: number
  currentAmountCents: number
  targetDate: string
  successProbability?: number // 0..100
  isPublic: boolean
}

export interface ProgressPost {
  id: string
  userId: string
  goalId?: string
  createdAt: string
  type: 'milestone' | 'update' | 'tip' | 'celebration'
  content: string // short text
  mediaUrl?: string // optional image
  metrics: {
    likes: number
    comments: number
    reposts: number
  }
  likedByMe?: boolean
  repostedByMe?: boolean
  user?: PublicUser // populated when fetching posts
  goal?: PublicGoal // populated when fetching posts
}

export interface Comment {
  id: string
  postId: string
  userId: string
  createdAt: string
  text: string
  user?: PublicUser // populated when fetching comments
}

export interface CommunityFilters {
  category?: GoalCategory[]
  location?: {
    country?: string
    region?: string
    city?: string
  }
  sortBy?: 'newest' | 'trending' | 'nearby'
  search?: string
}

export interface LeaderboardEntry {
  user: PublicUser
  rank: number
  score: number
  metric: 'xp' | 'streak' | 'progress' | 'goals_achieved'
  value: number
  change?: number // rank change from previous period
}

export interface CommunityStats {
  totalUsers: number
  totalPosts: number
  totalGoals: number
  activeUsers: number
  topCategories: {
    category: GoalCategory
    count: number
  }[]
}

// Post interaction types
export interface PostInteraction {
  type: 'like' | 'comment' | 'repost'
  postId: string
  userId: string
  timestamp: string
}

// Follow/Connection types
export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

export interface Connection {
  id: string
  userId1: string
  userId2: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  acceptedAt?: string
}

// Community challenge types
export interface CommunityChallenge {
  id: string
  title: string
  description: string
  type: 'weekly' | 'monthly' | 'seasonal'
  startDate: string
  endDate: string
  participants: number
  reward: {
    xp: number
    badge?: string
  }
  isActive: boolean
}

// Notification types for community
export interface CommunityNotification {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow' | 'milestone' | 'challenge'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}
