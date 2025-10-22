"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Users } from "lucide-react"
import CommunityTopBar from "@/components/community/CommunityTopBar"
import FeedTab from "@/components/community/FeedTab"
import DirectoryTab from "@/components/community/DirectoryTab"
import LeaderboardTab from "@/components/community/LeaderboardTab"
import type { CommunityFilters } from "@/types/community"

function CommunityContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'feed' | 'directory' | 'leaderboard'>('feed')
  const [filters, setFilters] = useState<CommunityFilters>({
    sortBy: 'newest'
  })

  useEffect(() => {
    const tab = searchParams.get('tab') as 'feed' | 'directory' | 'leaderboard'
    if (tab && ['feed', 'directory', 'leaderboard'].includes(tab)) {
      setActiveTab(tab)
    } else {
      // Check localStorage for last used tab
      const lastTab = localStorage.getItem('community-last-tab') as 'feed' | 'directory' | 'leaderboard'
      if (lastTab && ['feed', 'directory', 'leaderboard'].includes(lastTab)) {
        setActiveTab(lastTab)
      }
    }
  }, [searchParams])

  useEffect(() => {
    // Save active tab to localStorage
    localStorage.setItem('community-last-tab', activeTab)
  }, [activeTab])

  const handleTabChange = (tab: 'feed' | 'directory' | 'leaderboard') => {
    setActiveTab(tab)
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url.toString())
  }

  const handleFiltersChange = (newFilters: CommunityFilters) => {
    setFilters(newFilters)
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedTab filters={filters} />
      case 'directory':
        return <DirectoryTab filters={filters} />
      case 'leaderboard':
        return <LeaderboardTab filters={filters} />
      default:
        return <FeedTab filters={filters} />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="w-full">
        <DashboardPageLayout
          header={{
            title: "Community",
            description: `Connect with fellow financial rebels`,
            icon: Users,
          }}
        >
          <CommunityTopBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          
          <div className="mt-6">
            {renderActiveTab()}
          </div>
        </DashboardPageLayout>
      </div>

      <div className="hidden lg:block">
        <div className="space-y-6 py-sides sticky top-0">
          {/* Right rail content - can be reused from other pages */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-display uppercase mb-4">Community Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-mono">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posts Today</span>
                <span className="font-mono">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Goals Shared</span>
                <span className="font-mono">2,156</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-display uppercase mb-4">Weekly Challenge</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Save $50 this week and earn 100 XP!
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">$30 / $50 saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="w-full">
          <DashboardPageLayout
            header={{
              title: "Community",
              description: `Connect with fellow financial rebels`,
              icon: Users,
            }}
          >
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </DashboardPageLayout>
        </div>
        <div className="hidden lg:block">
          <div className="space-y-6 py-sides sticky top-0">
            <div className="bg-card rounded-lg border p-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CommunityContent />
    </Suspense>
  )
}
