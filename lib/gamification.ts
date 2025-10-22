import type { GamificationData, Badge, Transaction, Goal } from "@/types/finance"

// XP rewards
export const XP_REWARDS = {
  transactionLogged: 5,
  stayOnBudget: 50,
  weeklyGoalMet: 200,
  milestoneReached: 500,
  challengeCompleted: 100,
  streakDay: 10,
  // Learning rewards
  lessonCompleted: 10,
  perfectLesson: 15,
  practiceExercise: 1,
  checkpointCompleted: 20,
  learningStreak: 5,
}

// Badge definitions
export const ALL_BADGES: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete onboarding",
    icon: "🎯",
    category: "behavioral",
    unlocked: false,
    requirement: "Complete the onboarding process",
  },
  {
    id: "saver-initiate",
    name: "Saver Initiate",
    description: "Save your first $100",
    icon: "💰",
    category: "saving",
    unlocked: false,
    requirement: "Reach $100 in savings",
  },
  {
    id: "budget-pro",
    name: "Budget Pro",
    description: "Stay on budget for 7 days",
    icon: "📊",
    category: "behavioral",
    unlocked: false,
    requirement: "Maintain budget for 7 consecutive days",
  },
  {
    id: "transaction-master",
    name: "Transaction Master",
    description: "Log 50 transactions",
    icon: "📝",
    category: "behavioral",
    unlocked: false,
    requirement: "Record 50 transactions",
  },
  {
    id: "quarter-champion",
    name: "Quarter Champion",
    description: "Reach 25% of your goal",
    icon: "🏆",
    category: "milestone",
    unlocked: false,
    requirement: "Achieve 25% of goal target",
  },
  {
    id: "midway-milestone",
    name: "Midway Milestone",
    description: "Reach 50% of your goal",
    icon: "🎖️",
    category: "milestone",
    unlocked: false,
    requirement: "Achieve 50% of goal target",
  },
  {
    id: "almost-there",
    name: "Almost There",
    description: "Reach 75% of your goal",
    icon: "🌟",
    category: "milestone",
    unlocked: false,
    requirement: "Achieve 75% of goal target",
  },
  {
    id: "goal-achieved",
    name: "Goal Crusher",
    description: "Reach 100% of your goal",
    icon: "🎉",
    category: "milestone",
    unlocked: false,
    requirement: "Complete your financial goal",
  },
  {
    id: "streak-warrior",
    name: "Streak Warrior",
    description: "Maintain a 30-day streak",
    icon: "🔥",
    category: "behavioral",
    unlocked: false,
    requirement: "Keep a 30-day budget streak",
  },
  {
    id: "subscription-slayer",
    name: "Subscription Slayer",
    description: "Cancel 3 subscriptions",
    icon: "✂️",
    category: "saving",
    unlocked: false,
    requirement: "Identify and cancel 3 unused subscriptions",
  },
  // Learning badges
  {
    id: "first-lesson",
    name: "First Lesson",
    description: "Complete your first lesson",
    icon: "📚",
    category: "learning",
    unlocked: false,
    requirement: "Complete your first learning lesson",
  },
  {
    id: "perfect-student",
    name: "Perfect Student",
    description: "Complete a lesson perfectly",
    icon: "🌟",
    category: "learning",
    unlocked: false,
    requirement: "Complete a lesson without losing any hearts",
  },
  {
    id: "learning-streak-7",
    name: "7-Day Learning Streak",
    description: "Learn for 7 consecutive days",
    icon: "🔥",
    category: "learning",
    unlocked: false,
    requirement: "Maintain a 7-day learning streak",
  },
  {
    id: "budgeting-pro-i",
    name: "Budgeting Pro I",
    description: "Master budgeting basics",
    icon: "💰",
    category: "learning",
    unlocked: false,
    requirement: "Complete all budgeting skill lessons",
  },
  {
    id: "budgeting-pro-ii",
    name: "Budgeting Pro II",
    description: "Advanced budgeting expert",
    icon: "💎",
    category: "learning",
    unlocked: false,
    requirement: "Complete all budgeting skills with perfect scores",
  },
  {
    id: "checkpoint-master",
    name: "Checkpoint Master",
    description: "Complete your first checkpoint",
    icon: "🛡️",
    category: "learning",
    unlocked: false,
    requirement: "Complete a unit checkpoint",
  },
  {
    id: "practice-makes-perfect",
    name: "Practice Makes Perfect",
    description: "Complete 50 practice exercises",
    icon: "🎯",
    category: "learning",
    unlocked: false,
    requirement: "Complete 50 practice exercises",
  },
]

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1
}

export function getLevelTitle(level: number): string {
  if (level === 1) return "Budgeting Beginner"
  if (level < 5) return "Savings Apprentice"
  if (level < 10) return "Financial Enthusiast"
  if (level < 15) return "Money Manager"
  if (level < 20) return "Savings Specialist"
  return "Financial Guru"
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  return currentLevel * 1000
}

export function calculateXPForNextLevel(level: number): number {
  return level * 1000
}

export function checkBadgeUnlocks(
  gamification: GamificationData,
  goal: Goal | null,
  transactions: Transaction[],
  learningData?: {
    lessonsCompleted: number
    perfectLessons: number
    learningStreak: number
    checkpointsCompleted: number
    practiceExercisesCompleted: number
    skillsCompleted: Record<string, boolean>
    skillsPerfect: Record<string, boolean>
  }
): Badge[] {
  const unlockedBadges: Badge[] = []

  gamification.badges.forEach((badge) => {
    if (badge.unlocked) return

    let shouldUnlock = false

    switch (badge.id) {
      case "first-steps":
        shouldUnlock = true // Unlocked after onboarding
        break
      case "saver-initiate":
        shouldUnlock = goal ? goal.currentAmount >= 100 : false
        break
      case "budget-pro":
        shouldUnlock = gamification.streak >= 7
        break
      case "transaction-master":
        shouldUnlock = transactions.length >= 50
        break
      case "quarter-champion":
        shouldUnlock = goal ? (goal.currentAmount / goal.targetAmount) * 100 >= 25 : false
        break
      case "midway-milestone":
        shouldUnlock = goal ? (goal.currentAmount / goal.targetAmount) * 100 >= 50 : false
        break
      case "almost-there":
        shouldUnlock = goal ? (goal.currentAmount / goal.targetAmount) * 100 >= 75 : false
        break
      case "goal-achieved":
        shouldUnlock = goal ? (goal.currentAmount / goal.targetAmount) * 100 >= 100 : false
        break
      case "streak-warrior":
        shouldUnlock = gamification.streak >= 30
        break
      // Learning badges
      case "first-lesson":
        shouldUnlock = learningData ? learningData.lessonsCompleted >= 1 : false
        break
      case "perfect-student":
        shouldUnlock = learningData ? learningData.perfectLessons >= 1 : false
        break
      case "learning-streak-7":
        shouldUnlock = learningData ? learningData.learningStreak >= 7 : false
        break
      case "budgeting-pro-i":
        shouldUnlock = learningData ? learningData.skillsCompleted['budgeting_basics'] : false
        break
      case "budgeting-pro-ii":
        shouldUnlock = learningData ? learningData.skillsPerfect['budgeting_basics'] : false
        break
      case "checkpoint-master":
        shouldUnlock = learningData ? learningData.checkpointsCompleted >= 1 : false
        break
      case "practice-makes-perfect":
        shouldUnlock = learningData ? learningData.practiceExercisesCompleted >= 50 : false
        break
    }

    if (shouldUnlock) {
      badge.unlocked = true
      badge.unlockedAt = new Date().toISOString()
      unlockedBadges.push(badge)
    }
  })

  return unlockedBadges
}

export function addXP(gamification: GamificationData, amount: number): GamificationData {
  const newXP = gamification.xp + amount
  const newLevel = calculateLevel(newXP)

  return {
    ...gamification,
    xp: newXP,
    level: newLevel,
  }
}

export function updateStreak(gamification: GamificationData, stayedOnBudget: boolean): GamificationData {
  const today = new Date().toISOString().split("T")[0]
  const lastStreakDate = gamification.lastStreakDate.split("T")[0]

  if (stayedOnBudget) {
    const newStreak = today === lastStreakDate ? gamification.streak : gamification.streak + 1
    const newLongestStreak = Math.max(newStreak, gamification.longestStreak)

    return {
      ...gamification,
      streak: newStreak,
      longestStreak: newLongestStreak,
      lastStreakDate: new Date().toISOString(),
    }
  } else {
    return {
      ...gamification,
      streak: 0,
      lastStreakDate: new Date().toISOString(),
    }
  }
}

// Learning-specific functions
export function addLearningXP(gamification: GamificationData, amount: number): GamificationData {
  return addXP(gamification, amount)
}

export function checkLearningBadgeUnlocks(
  gamification: GamificationData,
  learningData: {
    lessonsCompleted: number
    perfectLessons: number
    learningStreak: number
    checkpointsCompleted: number
    practiceExercisesCompleted: number
    skillsCompleted: Record<string, boolean>
    skillsPerfect: Record<string, boolean>
  }
): Badge[] {
  return checkBadgeUnlocks(gamification, null, [], learningData)
}
