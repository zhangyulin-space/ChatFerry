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

            <div className="bg-background/20 rounded-lg p-4 mb-4">
              <h3 className="text-primary font-bold mb-2">背景提示</h3>
              <p className="text-sm text-foreground/80 mb-3">
                在迷雾城中，每个居民都被困在自己的记忆迷宫里。他们渴望交流，却又害怕靠近。
                你的任务是通过对话帮助他们：
              </p>
              <ul className="text-sm text-foreground/80 space-y-2 list-disc list-inside">
                <li>倾听他们的故事，展现理解和同理心</li>
                <li>探讨迷雾的本质，帮助他们连接记忆碎片</li>
                <li>讨论身份认同和存在的意义</li>
                <li>分享你的想法，但不要强迫他们接受</li>
              </ul>
            </div>

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