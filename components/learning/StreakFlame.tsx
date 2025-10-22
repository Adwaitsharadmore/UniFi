"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Flame } from "lucide-react"

interface StreakFlameProps {
  streak: number
}

export function StreakFlame({ streak }: StreakFlameProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
      </motion.div>
      <span className="text-sm font-bold text-orange-600">
        {streak}
      </span>
    </div>
  )
}
