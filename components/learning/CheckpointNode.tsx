"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface CheckpointNodeProps {
  checkpointId: string
  unitTitle: string
}

export function CheckpointNode({ checkpointId, unitTitle }: CheckpointNodeProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/dashboard/learning/checkpoint/${checkpointId}`)
  }

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
        size="lg"
        onClick={handleClick}
        className={cn(
          "relative px-6 py-3 rounded-full transition-all duration-200",
          "bg-gradient-to-r from-purple-500/10 to-blue-500/10",
          "border-purple-500/30 text-purple-600",
          "shadow-lg shadow-purple-500/20",
          "hover:from-purple-500/20 hover:to-blue-500/20",
          "hover:border-purple-500/50 hover:shadow-purple-500/30"
        )}
      >
        <Shield className="h-5 w-5 mr-2" />
        <span className="font-bold">Checkpoint</span>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-sm -z-10" />
      </Button>
      
      <div className="text-center">
        <p className="text-xs font-medium text-purple-600 max-w-24 truncate">
          {unitTitle} Test
        </p>
      </div>
    </motion.div>
  )
}
