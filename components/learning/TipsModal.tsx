"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Lightbulb, ExternalLink, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tip } from "@/types/learning"

interface TipsModalProps {
  open: boolean
  onClose: () => void
  tip: Tip | null
}

export function TipsModal({ open, onClose, tip }: TipsModalProps) {
  if (!tip) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xl">{tip.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tips List */}
          <div className="space-y-4">
            {tip.bullets.map((bullet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm leading-relaxed">{bullet}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources */}
          {tip.link && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-muted/50 rounded-lg border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">Learn More</h4>
                  <p className="text-sm text-muted-foreground">
                    Get additional resources and detailed guides
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(tip.link, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Guide
                </Button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // TODO: Navigate to practice for this skill
                onClose()
              }}
            >
              Practice Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
