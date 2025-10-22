"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface HeartsProps {
  hearts: number
  maxHearts: number
}

export function Hearts({ hearts, maxHearts }: HeartsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, index) => {
        const isActive = index < hearts
        return (
          <motion.div
            key={index}
            initial={{ scale: 1 }}
            animate={{ 
              scale: isActive ? 1 : 0.7,
              opacity: isActive ? 1 : 0.3
            }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isActive ? "text-red-500 fill-red-500" : "text-muted-foreground"
              )}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
