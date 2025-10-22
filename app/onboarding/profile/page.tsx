"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveUser, DEFAULT_USER } from "@/lib/finance-data"
import type { User } from "@/types/finance"

export default function OnboardingProfile() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const user: User = {
      ...DEFAULT_USER,
      name: formData.name,
      email: formData.email,
    }

    saveUser(user)
    router.push("/onboarding/goal-type")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-display uppercase tracking-tight">Create Your Profile</h1>
          <p className="text-sm text-muted-foreground uppercase">Step 1 of 3</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="uppercase text-xs font-display">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="uppercase text-xs font-display">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onClick={() => router.push("/onboarding")}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 uppercase font-display"
              disabled={!formData.name || !formData.email}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
