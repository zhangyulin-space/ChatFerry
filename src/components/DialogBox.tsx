import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'
import { DialogChoice } from '../game/state/dialogSlice'

interface DialogBoxProps {
  isVisible: boolean
  characterName?: string
  content: string
  choices?: DialogChoice[] | null
  onNext?: () => void
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  isVisible,
  characterName,
  content,
  choices,
  onNext
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="container mx-auto max-w-3xl">
            {characterName && (
              <div className="text-primary font-bold mb-2 text-lg">
                {characterName}
              </div>
            )}
            
            <div className="text-foreground mb-6 leading-relaxed">
              {content}
            </div>

            {choices && choices.length > 0 && (
              <div className="space-y-2 mb-4">
                {choices.map(choice => (
                  <button
                    key={choice.id}
                    className="w-full text-left p-3 rounded-lg bg-primary/20 hover:bg-primary/30 
                             transition-colors duration-200 text-foreground"
                    onClick={() => {
                      AudioController.playUISound('select')
                      if (onNext) onNext()
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}



            {onNext && !choices && (
              <div 
                className="text-foreground/60 text-sm text-right cursor-pointer 
                         hover:text-foreground transition-colors"
                onClick={() => {
                  AudioController.playUISound('click')
                  onNext()
                }}
              >
                继续探索 →
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 