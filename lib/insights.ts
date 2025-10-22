import type { Transaction, CategorySpending, Insight } from "@/types/finance"

export function generateInsights(transactions: Transaction[], categorySpending: CategorySpending[]): Insight[] {
  const insights: Insight[] = []

  // Analyze dining spending
  const diningCategory = categorySpending.find((c) => c.category === "Dining")
  if (diningCategory && diningCategory.percentage > 15) {
    insights.push({
      id: `insight-dining-${Date.now()}`,
      type: "opportunity",
      title: "Reduce dining expenses",
      description: `You spend ${diningCategory.percentage.toFixed(1)}% of your budget on dining. Consider meal prepping to save money.`,
      potentialSavings: diningCategory.amount * 0.3,
      category: "Dining",
      actionable: true,
      priority: "high",
      createdAt: new Date().toISOString(),
    })
  }

  // Analyze subscriptions
  const subscriptions = transactions.filter((t) => t.category === "Subscriptions" && t.isRecurring)
  if (subscriptions.length >= 3) {
    const subscriptionTotal = subscriptions.reduce((sum, t) => sum + t.amount, 0)
    insights.push({
      id: `insight-subscriptions-${Date.now()}`,
      type: "opportunity",
      title: "Review your subscriptions",
      description: `You have ${subscriptions.length} recurring subscriptions. Cancel unused ones to save money.`,
      potentialSavings: subscriptionTotal * 0.3,
      category: "Subscriptions",
      actionable: true,
      priority: "medium",
      createdAt: new Date().toISOString(),
    })
  }

  // Analyze shopping spending
  const shoppingCategory = categorySpending.find((c) => c.category === "Shopping")
  if (shoppingCategory && shoppingCategory.percentage > 20) {
    insights.push({
      id: `insight-shopping-${Date.now()}`,
      type: "warning",
      title: "High shopping expenses",
      description: `Shopping accounts for ${shoppingCategory.percentage.toFixed(1)}% of your spending. Set a monthly budget to control costs.`,
      category: "Shopping",
      actionable: true,
      priority: "medium",
      createdAt: new Date().toISOString(),
    })
  }

  // Detect unusual transactions
  const unusualTransactions = transactions.filter((t) => t.isUnusual)
  if (unusualTransactions.length > 0) {
    insights.push({
      id: `insight-unusual-${Date.now()}`,
      type: "warning",
      title: "Unusual large transactions detected",
      description: `We found ${unusualTransactions.length} unusually large transactions. Review them to ensure they're expected.`,
      actionable: false,
      priority: "high",
      createdAt: new Date().toISOString(),
    })
  }

  // Achievement: Good savings rate
  const income = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

  if (savingsRate > 30) {
    insights.push({
      id: `insight-savings-rate-${Date.now()}`,
      type: "achievement",
      title: "Excellent savings rate!",
      description: `Your savings rate of ${savingsRate.toFixed(1)}% is outstanding. Keep up the great work!`,
      actionable: false,
      priority: "low",
      createdAt: new Date().toISOString(),
    })
  }

  return insights
}
