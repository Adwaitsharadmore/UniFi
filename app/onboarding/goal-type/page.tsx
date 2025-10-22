"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getUser, saveUser } from "@/lib/finance-data"
import { cn } from "@/lib/utils"

const GOAL_TYPES = [
  {
    id: "individual" as const,
    title: "Individual",
    description: "Personal financial goals",
    icon: "👤",
  },
  {
    id: "couple" as const,
    title: "Couple",
    description: "Shared goals with your partner",
    icon: "💑",
  },
  {
    id: "family" as const,
    title: "Family",
    description: "Family financial planning",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "roommates" as const,
    title: "Roommates",
    description: "Split expenses and save together",
    icon: "🏠",
  },
]

export default function OnboardingGoalType() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleContinue = () => {
    if (!selectedType) return

    const user = getUser()
    if (user) {
      saveUser({
        ...user,
        goalType: selectedType as any,
      })
    }

    router.push("/onboarding/goal-setup")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-display uppercase tracking-tight">Choose Your Goal Type</h1>
          <p className="text-sm text-muted-foreground uppercase">Step 2 of 3</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOAL_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "p-6 rounded-lg border-2 transition-all text-left",
                "hover:border-primary/50 hover:bg-accent",
                selectedType === type.id ? "border-primary bg-primary/5" : "border-border bg-card",
              )}
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <div className="font-display text-xl uppercase mb-2">{type.title}</div>
              <div className="text-sm text-muted-foreground">{type.description}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 uppercase font-display bg-transparent"
            onClick={() => router.push("/onboarding/profile")}
          >
            Back
          </Button>
          <Button className="flex-1 uppercase font-display" disabled={!selectedType} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
