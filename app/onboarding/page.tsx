"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isOnboardingComplete } from "@/lib/finance-data"
import { Button } from "@/components/ui/button"
import MonkeyIcon from "@/components/icons/monkey"

export default function OnboardingWelcome() {
  const router = useRouter()

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="size-32 rounded-lg bg-primary/10 flex items-center justify-center">
            <MonkeyIcon className="size-24 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-display uppercase tracking-tight">Welcome to M.O.N.K.Y.</h1>
          <p className="text-xl text-muted-foreground uppercase tracking-wide">Financial Management OS</p>
        </div>

        <div className="space-y-6 max-w-xl mx-auto">
          <p className="text-lg text-foreground/80">
            Take control of your financial future with gamified goal tracking, intelligent insights, and collaborative
            money management.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-accent border border-border">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-display text-sm uppercase">Set Goals</div>
              <div className="text-xs text-muted-foreground mt-1">Track progress toward your financial dreams</div>
            </div>
            <div className="p-4 rounded-lg bg-accent border border-border">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-display text-sm uppercase">Get Insights</div>
              <div className="text-xs text-muted-foreground mt-1">AI-powered recommendations to save more</div>
            </div>
            <div className="p-4 rounded-lg bg-accent border border-border">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-display text-sm uppercase">Earn Rewards</div>
              <div className="text-xs text-muted-foreground mt-1">Unlock badges and level up your finances</div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            className="text-lg px-8 uppercase font-display"
            onClick={() => router.push("/onboarding/profile")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
