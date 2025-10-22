import type {
  Transaction,
  CategorySpending,
  FinancialMetrics,
  GoalProgress,
  Goal,
  SpendingPattern,
  FinancialChartData,
  TimePeriod,
} from "@/types/finance"
import { startOfMonth, subDays, format, addMonths } from "date-fns"

export function calculateFinancialMetrics(transactions: Transaction[]): FinancialMetrics {
  const income = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)

  const netSavings = income - expenses
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0

  // Calculate date range
  const dates = transactions.map((t) => new Date(t.date))
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))
  const daysDiff = Math.max(1, (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))

  const averageDailySpending = expenses / daysDiff

  // Estimate monthly values (assuming 30 days)
  const monthlyIncome = (income / daysDiff) * 30
  const monthlyExpenses = (expenses / daysDiff) * 30

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netSavings,
    savingsRate,
    averageDailySpending,
    monthlyIncome,
    monthlyExpenses,
  }
}

export function calculateCategorySpending(transactions: Transaction[]): CategorySpending[] {
  const categoryMap = new Map<string, { amount: number; count: number }>()

  const expenses = transactions.filter((t) => t.type === "debit")
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  expenses.forEach((txn) => {
    const existing = categoryMap.get(txn.category) || { amount: 0, count: 0 }
    categoryMap.set(txn.category, {
      amount: existing.amount + txn.amount,
      count: existing.count + 1,
    })
  })

  const result: CategorySpending[] = []
  categoryMap.forEach((data, category) => {
    result.push({
      category: category as any,
      amount: data.amount,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      transactionCount: data.count,
    })
  })

  return result.sort((a, b) => b.amount - a.amount)
}

export function calculateGoalProgress(goal: Goal, metrics: FinancialMetrics): GoalProgress {
  const progressPercentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)

  const remainingAmount = goal.targetAmount - goal.currentAmount
  const monthlySavingsRate = metrics.monthlyIncome - metrics.monthlyExpenses

  const monthsToGoal = monthlySavingsRate > 0 ? remainingAmount / monthlySavingsRate : 999

  const projectedCompletionDate = addMonths(new Date(), Math.ceil(monthsToGoal)).toISOString()

  const targetDate = new Date(goal.deadline)
  const now = new Date()
  const monthsUntilDeadline = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)

  const requiredMonthlySavings = monthsUntilDeadline > 0 ? remainingAmount / monthsUntilDeadline : 0

  const isOnTrack = monthsToGoal <= monthsUntilDeadline

  // Confidence score based on consistency and progress
  const savingsConsistency = metrics.savingsRate > 0 ? 1 : 0
  const progressScore = progressPercentage / 100
  const confidenceScore = Math.min(100, (savingsConsistency * 0.6 + progressScore * 0.4) * 100)

  return {
    currentAmount: goal.currentAmount,
    targetAmount: goal.targetAmount,
    progressPercentage,
    projectedCompletionDate,
    monthsToGoal,
    confidenceScore,
    isOnTrack,
    requiredMonthlySavings,
  }
}

export function analyzeSpendingPatterns(transactions: Transaction[]): SpendingPattern[] {
  const dayMap = new Map<string, { amount: number; count: number }>()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  transactions
    .filter((t) => t.type === "debit")
    .forEach((txn) => {
      const date = new Date(txn.date)
      const dayName = days[date.getDay()]
      const existing = dayMap.get(dayName) || { amount: 0, count: 0 }
      dayMap.set(dayName, {
        amount: existing.amount + txn.amount,
        count: existing.count + 1,
      })
    })

  return days.map((day) => {
    const data = dayMap.get(day) || { amount: 0, count: 0 }
    return {
      dayOfWeek: day,
      amount: data.amount,
      transactionCount: data.count,
    }
  })
}

export function generateChartData(transactions: Transaction[], period: TimePeriod): FinancialChartData[] {
  if (transactions.length === 0) return []

  const data: FinancialChartData[] = []
  
  // Get the actual date range from transactions
  const dates = transactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime())
  const minDate = dates[0]
  const maxDate = dates[dates.length - 1]

  let periods: Date[] = []
  let formatStr = "MM/dd"

  switch (period) {
    case "week":
      // Show the last 7 days of transaction data
      periods = Array.from({ length: 7 }, (_, i) => subDays(maxDate, 6 - i))
      formatStr = "MM/dd"
      break
    case "month":
      // Show the last 30 days of transaction data
      periods = Array.from({ length: 30 }, (_, i) => subDays(maxDate, 29 - i))
      formatStr = "MM/dd"
      break
    case "quarter":
      // Show the last 12 weeks of transaction data
      periods = Array.from({ length: 12 }, (_, i) => subDays(maxDate, (11 - i) * 7))
      formatStr = "MM/dd"
      break
    case "year":
      // Show monthly data for the transaction period
      const monthsDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
      const monthsToShow = Math.min(12, Math.max(1, monthsDiff))
      periods = Array.from({ length: monthsToShow }, (_, i) => {
        const monthDate = new Date(minDate.getFullYear(), minDate.getMonth() + i, 1)
        return monthDate
      })
      formatStr = "MMM"
      break
  }

  periods.forEach((date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const dayTransactions = transactions.filter((t) => t.date.startsWith(dateStr))

    const income = dayTransactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
    const expenses = dayTransactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)

    data.push({
      date: format(date, formatStr),
      income,
      expenses,
      savings: income - expenses,
    })
  })

  return data
}

export function calculateAnalytics(transactions: Transaction[], goal: Goal | null) {
  const metrics = calculateFinancialMetrics(transactions)

  if (!goal) {
    return {
      ...metrics,
      goalProgress: 0,
      monthlyNet: metrics.monthlyIncome - metrics.monthlyExpenses,
    }
  }

  const progress = calculateGoalProgress(goal, metrics)

  return {
    ...metrics,
    goalProgress: progress.progressPercentage,
    monthlyNet: metrics.monthlyIncome - metrics.monthlyExpenses,
    isOnTrack: progress.isOnTrack,
    monthsToGoal: progress.monthsToGoal,
  }
}
