import React from 'react'
import { motion } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface SaveMenuButtonProps {
  onSave: () => void
  onLoad: () => void
}

export const SaveMenuButton: React.FC<SaveMenuButtonProps> = ({ onSave, onLoad }) => {
  const handleSave = async () => {
    await AudioController.playUISound('hover')
    onSave()
  }

  const handleLoad = async () => {
    await AudioController.playUISound('hover')
    onLoad()
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="px-4 py-2 bg-primary/80 hover:bg-primary text-foreground rounded-lg transition-colors"
      >
        保存
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLoad}
        className="px-4 py-2 bg-primary/80 hover:bg-primary text-foreground rounded-lg transition-colors"
      >
        读取
      </motion.button>
    </div>
  )
} 