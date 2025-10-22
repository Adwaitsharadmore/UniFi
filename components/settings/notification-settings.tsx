"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { UserSettings } from "@/types/finance"
import { Bell } from "lucide-react"

interface NotificationSettingsProps {
  settings: UserSettings
  onUpdate: (settings: UserSettings) => void
}

export default function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const handleToggle = (key: keyof typeof settings.notifications, value: boolean) => {
    onUpdate({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    })
  }

  const handleThresholdChange = (value: string) => {
    onUpdate({
      ...settings,
      notifications: {
        ...settings.notifications,
        largeTransactionThreshold: Number.parseInt(value) || 100,
      },
    })
  }

  const handleFrequencyChange = (value: string) => {
    onUpdate({
      ...settings,
      notifications: {
        ...settings.notifications,
        frequency: value as any,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          NOTIFICATION SETTINGS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <Bell className="size-5 text-primary" />
          <p className="text-sm">Manage how and when you receive notifications about your finances</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex-1">
              <Label htmlFor="large-transactions" className="text-sm font-medium cursor-pointer">
                Large Transactions
              </Label>
              <p className="text-xs text-muted-foreground">Get notified about transactions above threshold</p>
            </div>
            <Switch
              id="large-transactions"
              checked={settings.notifications.largeTransactions}
              onCheckedChange={(checked) => handleToggle("largeTransactions", checked)}
            />
          </div>

          {settings.notifications.largeTransactions && (
            <div className="ml-4 space-y-2">
              <Label htmlFor="threshold" className="uppercase text-xs font-display">
                Threshold Amount ($)
              </Label>
              <Input
                id="threshold"
                type="number"
                value={settings.notifications.largeTransactionThreshold}
                onChange={(e) => handleThresholdChange(e.target.value)}
                className="h-10"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex-1">
              <Label htmlFor="daily-summary" className="text-sm font-medium cursor-pointer">
                Daily Summary
              </Label>
              <p className="text-xs text-muted-foreground">Receive end-of-day spending recap</p>
            </div>
            <Switch
              id="daily-summary"
              checked={settings.notifications.dailySummary}
              onCheckedChange={(checked) => handleToggle("dailySummary", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex-1">
              <Label htmlFor="weekly-insights" className="text-sm font-medium cursor-pointer">
                Weekly Insights
              </Label>
              <p className="text-xs text-muted-foreground">Get personalized savings recommendations</p>
            </div>
            <Switch
              id="weekly-insights"
              checked={settings.notifications.weeklyInsights}
              onCheckedChange={(checked) => handleToggle("weeklyInsights", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex-1">
              <Label htmlFor="goal-milestones" className="text-sm font-medium cursor-pointer">
                Goal Milestones
              </Label>
              <p className="text-xs text-muted-foreground">Celebrate when you reach milestones</p>
            </div>
            <Switch
              id="goal-milestones"
              checked={settings.notifications.goalMilestones}
              onCheckedChange={(checked) => handleToggle("goalMilestones", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex-1">
              <Label htmlFor="budget-warnings" className="text-sm font-medium cursor-pointer">
                Budget Warnings
              </Label>
              <p className="text-xs text-muted-foreground">Alert when approaching budget limits</p>
            </div>
            <Switch
              id="budget-warnings"
              checked={settings.notifications.budgetWarnings}
              onCheckedChange={(checked) => handleToggle("budgetWarnings", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex-1">
              <Label htmlFor="streak-reminders" className="text-sm font-medium cursor-pointer">
                Streak Reminders
              </Label>
              <p className="text-xs text-muted-foreground">Reminders to maintain your streak</p>
            </div>
            <Switch
              id="streak-reminders"
              checked={settings.notifications.streakReminders}
              onCheckedChange={(checked) => handleToggle("streakReminders", checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency" className="uppercase text-xs font-display">
            Notification Frequency
          </Label>
          <Select value={settings.notifications.frequency} onValueChange={handleFrequencyChange}>
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
