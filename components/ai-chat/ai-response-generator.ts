import type { Transaction, Goal, User, GamificationData, Insight, CategorySpending } from "@/types/finance";

interface AIResponse {
  content: string;
  suggestions?: string[];
}

interface FinancialData {
  transactions: Transaction[];
  goal: Goal | null;
  user: User | null;
  gamification: GamificationData;
  insights: Insight[];
}

export async function generateAIResponse(
  userMessage: string,
  financialData: FinancialData
): Promise<AIResponse> {
  const { transactions, goal, user, gamification, insights } = financialData;
  
  // Analyze financial data
  const analysis = analyzeFinancialData(transactions, goal, gamification);
  
  // Generate response based on user message
  const response = await generateContextualResponse(userMessage, analysis, financialData);
  
  return response;
}

function analyzeFinancialData(transactions: Transaction[], goal: Goal | null, gamification: GamificationData) {
  const totalIncome = transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  
  // Category spending analysis
  const categorySpending: CategorySpending[] = [];
  const categoryTotals = new Map<string, number>();
  
  transactions
    .filter(t => t.type === "debit")
    .forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + t.amount);
    });
  
  categoryTotals.forEach((amount, category) => {
    categorySpending.push({
      category: category as any,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      transactionCount: transactions.filter(t => t.category === category && t.type === "debit").length
    });
  });
  
  categorySpending.sort((a, b) => b.amount - a.amount);
  
  // Goal progress
  const goalProgress = goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const monthsToGoal = goal ? calculateMonthsToGoal(goal, netSavings) : null;
  
  // Recent spending patterns
  const recentTransactions = transactions
    .filter(t => t.type === "debit")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    categorySpending,
    goalProgress,
    monthsToGoal,
    recentTransactions,
    level: gamification.level,
    streak: gamification.streak
  };
}

function calculateMonthsToGoal(goal: Goal, monthlySavings: number): number {
  if (monthlySavings <= 0) return Infinity;
  const remaining = goal.targetAmount - goal.currentAmount;
  return Math.ceil(remaining / monthlySavings);
}

async function generateContextualResponse(
  userMessage: string,
  analysis: any,
  financialData: FinancialData
): Promise<AIResponse> {
  const message = userMessage.toLowerCase();
  
  // Goal-related queries
  if (message.includes("goal") || message.includes("target") || message.includes("progress")) {
    return generateGoalResponse(analysis, financialData.goal);
  }
  
  // Spending analysis queries
  if (message.includes("spend") || message.includes("expense") || message.includes("category") || message.includes("budget")) {
    return generateSpendingResponse(analysis);
  }
  
  // Savings queries
  if (message.includes("save") || message.includes("saving") || message.includes("money")) {
    return generateSavingsResponse(analysis);
  }
  
  // Insights queries
  if (message.includes("insight") || message.includes("advice") || message.includes("recommend")) {
    return generateInsightsResponse(financialData.insights, analysis);
  }
  
  // General financial health
  if (message.includes("how am i doing") || message.includes("financial health") || message.includes("overview")) {
    return generateOverviewResponse(analysis, financialData.gamification);
  }
  
  // Recent transactions
  if (message.includes("recent") || message.includes("latest") || message.includes("transaction")) {
    return generateRecentTransactionsResponse(analysis);
  }
  
  // Default response
  return {
    content: "I can help you with your financial goals, spending analysis, savings strategies, and more. Try asking about your goal progress, spending categories, or how to save more money.",
    suggestions: [
      "How am I doing with my financial goals?",
      "What are my biggest spending categories?",
      "How can I save more money?",
      "Show me my recent transactions"
    ]
  };
}

function generateGoalResponse(analysis: any, goal: Goal | null): AIResponse {
  if (!goal) {
    return {
      content: "You don't have a financial goal set yet. Setting a goal is a great way to stay motivated and track your progress!",
      suggestions: ["How do I set a financial goal?", "What should my goal amount be?"]
    };
  }
  
  const progress = analysis.goalProgress;
  const monthsToGoal = analysis.monthsToGoal;
  
  let content = `Your goal: ${goal.name}\n`;
  content += `Target: $${goal.targetAmount.toLocaleString()}\n`;
  content += `Current: $${goal.currentAmount.toLocaleString()}\n`;
  content += `Progress: ${progress.toFixed(1)}%\n\n`;
  
  if (monthsToGoal === Infinity) {
    content += "⚠️ You're not currently saving enough to reach your goal. Consider increasing your savings rate or adjusting your timeline.";
  } else if (monthsToGoal <= 12) {
    content += `🎉 Great progress! You're on track to reach your goal in about ${monthsToGoal} months.`;
  } else {
    content += `You're making steady progress. At your current rate, you'll reach your goal in about ${monthsToGoal} months.`;
  }
  
  return {
    content,
    suggestions: [
      "How can I reach my goal faster?",
      "Should I adjust my goal amount?",
      "What's my savings rate?"
    ]
  };
}

function generateSpendingResponse(analysis: any): AIResponse {
  const { categorySpending, totalExpenses } = analysis;
  const topCategories = categorySpending.slice(0, 3);
  
  let content = `Your spending breakdown:\n\n`;
  
  topCategories.forEach((category, index) => {
    content += `${index + 1}. ${category.category}: $${category.amount.toFixed(0)} (${category.percentage.toFixed(1)}%)\n`;
  });
  
  content += `\nTotal expenses: $${totalExpenses.toFixed(0)}`;
  
  // Add insights
  const highestCategory = topCategories[0];
  if (highestCategory.percentage > 30) {
    content += `\n\n💡 ${highestCategory.category} is your biggest expense (${highestCategory.percentage.toFixed(1)}%). Consider if this aligns with your priorities.`;
  }
  
  return {
    content,
    suggestions: [
      "How can I reduce my spending?",
      "What's a good budget for each category?",
      "Show me my recent transactions"
    ]
  };
}

function generateSavingsResponse(analysis: any): AIResponse {
  const { netSavings, savingsRate, totalIncome } = analysis;
  
  let content = `Your savings summary:\n\n`;
  content += `Monthly savings: $${netSavings.toFixed(0)}\n`;
  content += `Savings rate: ${savingsRate.toFixed(1)}%\n`;
  content += `Monthly income: $${totalIncome.toFixed(0)}\n\n`;
  
  if (savingsRate >= 20) {
    content += `🎉 Excellent savings rate! You're saving ${savingsRate.toFixed(1)}% of your income.`;
  } else if (savingsRate >= 10) {
    content += `👍 Good savings rate! You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing it to 20% for better financial security.`;
  } else {
    content += `⚠️ Your savings rate is ${savingsRate.toFixed(1)}%. Try to increase it to at least 10-20% for better financial health.`;
  }
  
  return {
    content,
    suggestions: [
      "How can I increase my savings rate?",
      "What should I do with my savings?",
      "How much should I save each month?"
    ]
  };
}

function generateInsightsResponse(insights: Insight[], analysis: any): AIResponse {
  if (insights.length === 0) {
    return {
      content: "No specific insights available right now. Keep tracking your spending to get personalized recommendations!",
      suggestions: ["How can I get more insights?", "What should I track?"]
    };
  }
  
  const highPriorityInsights = insights.filter(i => i.priority === "high");
  const opportunities = insights.filter(i => i.type === "opportunity");
  
  let content = "Here are your financial insights:\n\n";
  
  if (highPriorityInsights.length > 0) {
    content += "🚨 High Priority:\n";
    highPriorityInsights.forEach(insight => {
      content += `• ${insight.title}: ${insight.description}\n`;
    });
    content += "\n";
  }
  
  if (opportunities.length > 0) {
    content += "💡 Opportunities:\n";
    opportunities.slice(0, 2).forEach(insight => {
      content += `• ${insight.title}: ${insight.description}\n`;
    });
  }
  
  return {
    content,
    suggestions: [
      "How can I act on these insights?",
      "Show me more opportunities",
      "What should I focus on first?"
    ]
  };
}

function generateOverviewResponse(analysis: any, gamification: GamificationData): AIResponse {
  const { netSavings, savingsRate, goalProgress, level, streak } = analysis;
  
  let content = `Your financial overview:\n\n`;
  content += `💰 Monthly savings: $${netSavings.toFixed(0)}\n`;
  content += `📊 Savings rate: ${savingsRate.toFixed(1)}%\n`;
  content += `🎯 Goal progress: ${goalProgress.toFixed(1)}%\n`;
  content += `⭐ Level: ${level}\n`;
  content += `🔥 Streak: ${streak} days\n\n`;
  
  if (savingsRate >= 20) {
    content += `🎉 You're doing excellent! Your savings rate is healthy and you're making great progress.`;
  } else if (savingsRate >= 10) {
    content += `👍 You're doing well! Consider increasing your savings rate to 20% for even better financial health.`;
  } else {
    content += `💪 Keep working on your financial habits! Focus on increasing your savings rate step by step.`;
  }
  
  return {
    content,
    suggestions: [
      "How can I improve my financial health?",
      "What should I focus on next?",
      "Show me my spending breakdown"
    ]
  };
}

function generateRecentTransactionsResponse(analysis: any): AIResponse {
  const { recentTransactions } = analysis;
  
  if (recentTransactions.length === 0) {
    return {
      content: "No recent transactions found. Start tracking your spending to get insights!",
      suggestions: ["How do I track transactions?", "What should I monitor?"]
    };
  }
  
  let content = "Your recent transactions:\n\n";
  
  recentTransactions.slice(0, 5).forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString();
    const amount = transaction.amount.toFixed(2);
    content += `• ${date}: ${transaction.description} - $${amount} (${transaction.category})\n`;
  });
  
  return {
    content,
    suggestions: [
      "Show me spending by category",
      "What are my biggest expenses?",
      "How can I reduce spending?"
    ]
  };
}
