"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Star, Trophy, Share2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CompletionModalProps {
  open: boolean
  onClose: () => void
  perfect: boolean
  xpEarned: number
  streakIncrement: number
}

export function CompletionModal({ 
  open, 
  onClose, 
  perfect, 
  xpEarned, 
  streakIncrement 
}: CompletionModalProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    
    // TODO: Implement actual community sharing
    // This would create a post in the community feed
    const shareData = {
      type: 'lesson_completion',
      perfect,
      xpEarned,
      streakIncrement,
      timestamp: new Date().toISOString()
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSharing(false)
    // TODO: Show success message or navigate to community
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {perfect ? "Perfect Lesson!" : "Lesson Complete!"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Celebration Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="flex justify-center"
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              perfect 
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600" 
                : "bg-gradient-to-br from-green-400 to-green-600"
            )}>
              {perfect ? (
                <Star className="h-10 w-10 text-white fill-white" />
              ) : (
                <Trophy className="h-10 w-10 text-white fill-white" />
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <span className="font-medium">XP Earned</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                +{xpEarned}
              </Badge>
            </div>

            <div className="flex justify-between items-center p-4 bg-orange-500/5 rounded-lg">
              <span className="font-medium">Streak</span>
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                +{streakIncrement}
              </Badge>
            </div>

            {perfect && (
              <div className="flex justify-between items-center p-4 bg-yellow-500/5 rounded-lg">
                <span className="font-medium">Perfect Bonus</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  +5 XP
                </Badge>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onClose}
              className="w-full"
              size="lg"
            >
              Continue Learning
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {isSharing ? "Sharing..." : "Share Achievement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
