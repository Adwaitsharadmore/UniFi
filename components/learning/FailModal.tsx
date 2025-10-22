"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { RotateCcw, Heart, BookOpen } from "lucide-react"

interface FailModalProps {
  open: boolean
  onRetry: () => void
  onPractice: () => void
}

export function FailModal({ open, onRetry, onPractice }: FailModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-red-600">
            Out of Hearts!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Broken Hearts Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="h-10 w-10 text-red-500 fill-red-500" />
            </div>
          </motion.div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Don't give up!</h3>
            <p className="text-muted-foreground">
              You've run out of hearts for this lesson. Practice to refill your hearts or try again tomorrow.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Button 
              onClick={onRetry}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again Tomorrow
            </Button>
            
            <Button 
              onClick={onPractice}
              className="w-full"
              size="lg"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Practice to Refill Hearts
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Hearts refill daily at midnight</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
