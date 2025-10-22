"use client"

import { useState, useCallback } from "react"
import { Search, Filter, SortAsc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CommunityFilters, GoalCategory } from "@/types/community"

interface CommunityTopBarProps {
  activeTab: 'feed' | 'directory' | 'leaderboard'
  onTabChange: (tab: 'feed' | 'directory' | 'leaderboard') => void
  filters: CommunityFilters
  onFiltersChange: (filters: CommunityFilters) => void
}

const GOAL_CATEGORIES: GoalCategory[] = [
  'Home', 'Emergency', 'Car', 'Tuition', 'Debt', 'Travel', 'Business', 'Retirement', 'Other'
]

const LOCATIONS = [
  { value: 'anywhere', label: 'Anywhere' },
  { value: 'usa', label: 'United States' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'florida', label: 'Florida' },
  { value: 'washington', label: 'Washington' },
  { value: 'massachusetts', label: 'Massachusetts' },
  { value: 'colorado', label: 'Colorado' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'arizona', label: 'Arizona' },
  { value: 'oregon', label: 'Oregon' }
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
  { value: 'nearby', label: 'Nearby' }
]

export default function CommunityTopBar({ 
  activeTab, 
  onTabChange, 
  filters, 
  onFiltersChange 
}: CommunityTopBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value })
    }, 250)
    return () => clearTimeout(timeoutId)
  }, [filters, onFiltersChange])

  const handleCategoryChange = (category: GoalCategory) => {
    const currentCategories = filters.category || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    onFiltersChange({ 
      ...filters, 
      category: newCategories.length > 0 ? newCategories : undefined 
    })
  }

  const handleLocationChange = (location: string) => {
    if (location === 'anywhere') {
      onFiltersChange({ ...filters, location: undefined })
    } else {
      onFiltersChange({ 
        ...filters, 
        location: { country: location === 'usa' ? 'USA' : undefined, region: location }
      })
    }
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as 'newest' | 'trending' | 'nearby' })
  }

  const clearFilters = () => {
    setSearchValue('')
    onFiltersChange({ sortBy: 'newest' })
  }

  const hasActiveFilters = filters.category?.length || filters.location || filters.search

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search people, posts, goals..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-accent")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {[filters.category?.length || 0, filters.location ? 1 : 0, filters.search ? 1 : 0].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>
          
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Goal Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {GOAL_CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.category?.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Location
              </label>
              <Select 
                value={filters.location?.region || filters.location?.country || 'anywhere'} 
                onValueChange={handleLocationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
        {[
          { id: 'feed', label: 'Feed' },
          { id: 'directory', label: 'Directory' },
          { id: 'leaderboard', label: 'Leaderboard' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id as 'feed' | 'directory' | 'leaderboard')}
            className={cn(
              "flex-1",
              activeTab === tab.id && "bg-background shadow-sm"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
