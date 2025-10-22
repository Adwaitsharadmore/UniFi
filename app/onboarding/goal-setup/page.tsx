"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  saveGoal,
  setOnboardingComplete,
  saveTransactions,
  saveGamification,
  DEFAULT_GAMIFICATION,
} from "@/lib/finance-data"
import { parseCSVTransactions, detectRecurringTransactions, detectUnusualTransactions } from "@/lib/transaction-parser"
import { ALL_BADGES, addXP, XP_REWARDS } from "@/lib/gamification"
import type { Goal } from "@/types/finance"

export default function OnboardingGoalSetup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create goal
    const goal: Goal = {
      id: "goal-1",
      name: formData.name,
      description: formData.description,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: Number.parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      createdAt: new Date().toISOString(),
      type: "individual",
    }

    saveGoal(goal)

    // Load sample transactions
    try {
      const response = await fetch("/sample-transactions.csv")
      const csvText = await response.text()
      let transactions = parseCSVTransactions(csvText)
      transactions = detectRecurringTransactions(transactions)
      transactions = detectUnusualTransactions(transactions)
      saveTransactions(transactions)
    } catch (error) {
      console.error("[v0] Failed to load sample transactions:", error)
    }

    // Initialize gamification with first badge
    let gamification = { ...DEFAULT_GAMIFICATION, badges: ALL_BADGES }
    gamification = addXP(gamification, XP_REWARDS.transactionLogged * 5) // Bonus XP for onboarding

    // Unlock first badge
    const firstBadge = gamification.badges.find((b) => b.id === "first-steps")
    if (firstBadge) {
      firstBadge.unlocked = true
      firstBadge.unlockedAt = new Date().toISOString()
    }

    saveGamification(gamification)

    // Mark onboarding complete
    setOnboardingComplete(true)

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-display uppercase tracking-tight">Set Your Financial Goal</h1>
          <p className="text-sm text-muted-foreground uppercase">Step 3 of 3</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="uppercase text-xs font-display">
                Goal Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Emergency Fund, Buy a House, Family Vacation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="uppercase text-xs font-display">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="What's this goal for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="uppercase text-xs font-display">
                  Target Amount ($)
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="10000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAmount" className="uppercase text-xs font-display">
                  Current Savings ($)
                </Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  min="0"
                  step="0.01"
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="uppercase text-xs font-display">
                Target Date
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
                className="h-12"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 uppercase font-display bg-transparent"
              onClick={() => router.push("/onboarding/goal-type")}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 uppercase font-display"
              disabled={!formData.name || !formData.targetAmount || !formData.deadline}
            >
              Complete Setup
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
