import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface OptionsButtonProps {
  onSave: () => void
  onLoad: () => void
  onShowAchievements: () => void
  onExit: () => void
}

export const OptionsButton: React.FC<OptionsButtonProps> = ({
  onSave,
  onLoad,
  onShowAchievements,
  onExit
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    AudioController.playUISound('click')
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (callback: () => void) => {
    AudioController.playUISound('select')
    callback()
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 right-4 z-30">
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm
                 hover:bg-background/40 transition-colors flex items-center justify-center"
      >
        <svg
          className="w-6 h-6 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 w-48 py-2 bg-background/90 backdrop-blur-sm
                     rounded-lg shadow-xl"
          >
            <button
              onClick={() => handleOptionClick(onSave)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              保存游戏
            </button>
            <button
              onClick={() => handleOptionClick(onLoad)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              读取游戏
            </button>
            <button
              onClick={() => handleOptionClick(onShowAchievements)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              查看成就
            </button>
            <div className="my-2 border-t border-foreground/10" />
            <button
              onClick={() => handleOptionClick(onExit)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              返回主菜单
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 