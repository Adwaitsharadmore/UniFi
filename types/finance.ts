// User and Goal Types
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  goalType: "individual" | "couple" | "family" | "roommates"
  createdAt: string
}

export interface Goal {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  createdAt: string
  type: "individual" | "couple" | "family" | "roommates"
  members?: GoalMember[]
}

export interface GoalMember {
  userId: string
  name: string
  avatar: string
  contributionAmount: number
  contributionPercentage: number
}

// Transaction Types
export interface Transaction {
  id: string
  date: string
  description: string
  merchant: string
  amount: number
  type: "debit" | "credit"
  category: TransactionCategory
  balance: number
  tags?: string[]
  isRecurring?: boolean
  isUnusual?: boolean
}

export type TransactionCategory =
  | "Shopping"
  | "Dining"
  | "Transportation"
  | "Healthcare"
  | "Subscriptions"
  | "Fitness"
  | "Housing"
  | "Income"
  | "Cash"
  | "Services"
  | "Entertainment"
  | "Groceries"
  | "Utilities"
  | "Other"

// Analytics Types
export interface CategorySpending {
  category: TransactionCategory
  amount: number
  percentage: number
  transactionCount: number
}

export interface SpendingPattern {
  dayOfWeek: string
  amount: number
  transactionCount: number
}

export interface FinancialMetrics {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  averageDailySpending: number
  monthlyIncome: number
  monthlyExpenses: number
}

export interface GoalProgress {
  currentAmount: number
  targetAmount: number
  progressPercentage: number
  projectedCompletionDate: string
  monthsToGoal: number
  confidenceScore: number
  isOnTrack: boolean
  requiredMonthlySavings: number
}

// Insight Types
export interface Insight {
  id: string
  type: "opportunity" | "warning" | "achievement"
  title: string
  description: string
  potentialSavings?: number
  category?: TransactionCategory
  actionable: boolean
  priority: "low" | "medium" | "high"
  createdAt: string
}

// Gamification Types
export interface GamificationData {
  xp: number
  level: number
  streak: number
  longestStreak: number
  badges: Badge[]
  challenges: Challenge[]
  lastStreakDate: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: "saving" | "behavioral" | "social" | "milestone"
  unlocked: boolean
  unlockedAt?: string
  requirement: string
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: "daily" | "weekly" | "custom"
  progress: number
  target: number
  reward: number
  active: boolean
  completedAt?: string
  expiresAt?: string
}

// Settings Types
export interface UserSettings {
  notifications: NotificationSettings
  preferences: UserPreferences
  connectedAccounts: ConnectedAccount[]
}

export interface NotificationSettings {
  largeTransactions: boolean
  largeTransactionThreshold: number
  dailySummary: boolean
  weeklyInsights: boolean
  goalMilestones: boolean
  budgetWarnings: boolean
  streakReminders: boolean
  frequency: "realtime" | "daily" | "weekly"
}

export interface UserPreferences {
  currency: string
  dateFormat: string
  theme: "dark" | "light"
}

export interface ConnectedAccount {
  id: string
  name: string
  type: string
  lastSync: string
}

// Chart Data Types
export interface FinancialChartData {
  date: string
  income: number
  expenses: number
  savings: number
  projectedSavings?: number
}

export type TimePeriod = "week" | "month" | "quarter" | "year"
