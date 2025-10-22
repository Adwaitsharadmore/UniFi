"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Lock, Check, Star } from "lucide-react"
import type { Skill, SkillStatus } from "@/types/learning"
import { motion } from "framer-motion"

interface SkillNodeProps {
  skill: Skill
  status: SkillStatus
  onClick: () => void
}

const statusConfig = {
  locked: {
    bg: "bg-muted/50",
    border: "border-muted",
    text: "text-muted-foreground",
    icon: Lock,
    glow: "",
    pulse: false
  },
  open: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    icon: null,
    glow: "shadow-lg shadow-primary/20",
    pulse: true
  },
  passed: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-600",
    icon: Check,
    glow: "shadow-lg shadow-green-500/20",
    pulse: false
  },
  perfect: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-600",
    icon: Star,
    glow: "shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-500/30",
    pulse: false
  }
}

export function SkillNode({ skill, status, onClick }: SkillNodeProps) {
  const config = statusConfig[status]
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        disabled={status === 'locked'}
        className={cn(
          "relative w-16 h-16 rounded-full transition-all duration-200",
          config.bg,
          config.border,
          config.text,
          config.glow,
          config.pulse && "animate-pulse",
          "hover:scale-105 focus:scale-105"
        )}
      >
        {IconComponent ? (
          <IconComponent className="h-6 w-6" />
        ) : (
          <span className="text-2xl">{skill.icon}</span>
        )}
        
        {/* Crown indicator for passed/perfect */}
        {(status === 'passed' || status === 'perfect') && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xs">👑</span>
          </div>
        )}
      </Button>
      
      <div className="text-center">
        <p className={cn(
          "text-xs font-medium max-w-20 truncate",
          config.text
        )}>
          {skill.title}
        </p>
      </div>
    </motion.div>
  )
}
