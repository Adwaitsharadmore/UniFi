"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface PathHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedSkill?: string | null
  onTipsClick: () => void
}

export function PathHeader({ 
  searchQuery, 
  onSearchChange, 
  selectedSkill, 
  onTipsClick 
}: PathHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="text-2xl font-bold">LEARNING</h1>
            <p className="text-sm text-muted-foreground">
              Master personal finance step by step
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onTipsClick}
            className={cn(
              "transition-all duration-200",
              selectedSkill && "bg-primary/10 border-primary/20 text-primary"
            )}
          >
            <Lightbulb className="h-4 w-4" />
            Tips
          </Button>
        </div>
      </div>
    </div>
  )
}
