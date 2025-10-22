"use client"

import type { User, Goal, Transaction, GamificationData, UserSettings, Insight } from "@/types/finance"
import { parseCSVTransactions, detectRecurringTransactions, detectUnusualTransactions } from "./transaction-parser"

// Storage keys
const STORAGE_KEYS = {
  USER: "finance_user",
  GOAL: "finance_goal",
  TRANSACTIONS: "finance_transactions",
  GAMIFICATION: "finance_gamification",
  SETTINGS: "finance_settings",
  INSIGHTS: "finance_insights",
  ONBOARDING_COMPLETE: "finance_onboarding_complete",
}

// Default data
export const DEFAULT_USER: User = {
  id: "user-1",
  name: "",
  email: "",
  avatar: "/avatars/user_krimson.png",
  goalType: "individual",
  createdAt: new Date().toISOString(),
}

export const DEFAULT_GAMIFICATION: GamificationData = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  badges: [],
  challenges: [],
  lastStreakDate: new Date().toISOString(),
}

export const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    largeTransactions: true,
    largeTransactionThreshold: 100,
    dailySummary: true,
    weeklyInsights: true,
    goalMilestones: true,
    budgetWarnings: true,
    streakReminders: true,
    frequency: "realtime",
  },
  preferences: {
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    theme: "dark",
  },
  connectedAccounts: [],
}

// Storage functions
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored) as T
      } catch {
        return defaultValue
      }
    }
  }
  return defaultValue
}

// User functions
export function saveUser(user: User): void {
  saveToStorage(STORAGE_KEYS.USER, user)
}

export function getUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.USER, null)
}

// Goal functions
export function saveGoal(goal: Goal): void {
  saveToStorage(STORAGE_KEYS.GOAL, goal)
}

export function getGoal(): Goal | null {
  return getFromStorage<Goal | null>(STORAGE_KEYS.GOAL, null)
}

// Transaction functions
export function saveTransactions(transactions: Transaction[]): void {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions)
}

export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, [])
}

// Load transactions from CSV data
export async function loadTransactionsFromCSV(): Promise<Transaction[]> {
  try {
    const response = await fetch('/data/transactions.csv')
    if (!response.ok) {
      throw new Error('Failed to load CSV data')
    }
    
    const csvData = await response.text()
    const transactions = parseCSVTransactions(csvData)
    
    // Detect recurring and unusual transactions
    const processedTransactions = detectUnusualTransactions(
      detectRecurringTransactions(transactions)
    )
    
    // Save to storage
    saveTransactions(processedTransactions)
    
    return processedTransactions
  } catch (error) {
    console.error('Error loading transactions from CSV:', error)
    return []
  }
}

// Initialize transactions with CSV data if not already loaded
export async function initializeTransactions(): Promise<Transaction[]> {
  const existingTransactions = getTransactions()

  if (existingTransactions.length === 0) {
    const loaded = await loadTransactionsFromCSV().catch((err) => {
      console.error(err)
      return [] as Transaction[]
    })
    return loaded
  }

  return existingTransactions
}

// Force reload transactions from CSV (useful for testing)
export async function reloadTransactionsFromCSV(): Promise<Transaction[]> {
  // Clear existing transactions
  saveTransactions([])
  
  // Load from CSV
  return await loadTransactionsFromCSV()
}

// Gamification functions
export function saveGamification(data: GamificationData): void {
  saveToStorage(STORAGE_KEYS.GAMIFICATION, data)
}

export function getGamification(): GamificationData {
  return getFromStorage<GamificationData>(STORAGE_KEYS.GAMIFICATION, DEFAULT_GAMIFICATION)
}

// Settings functions
export function saveSettings(settings: UserSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings)
}

export function getSettings(): UserSettings {
  return getFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
}

// Insights functions
export function saveInsights(insights: Insight[]): void {
  saveToStorage(STORAGE_KEYS.INSIGHTS, insights)
}

export function getInsights(): Insight[] {
  return getFromStorage<Insight[]>(STORAGE_KEYS.INSIGHTS, [])
}

// Onboarding functions
export function setOnboardingComplete(complete: boolean): void {
  saveToStorage(STORAGE_KEYS.ONBOARDING_COMPLETE, complete)
}

export function isOnboardingComplete(): boolean {
  return getFromStorage<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE, false)
}

// Clear all data
export function clearAllData(): void {
  if (typeof window !== "undefined") {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }
}
