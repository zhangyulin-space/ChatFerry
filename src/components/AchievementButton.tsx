import React from 'react'
import { motion } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface AchievementButtonProps {
  onClick: () => void
}

export const AchievementButton: React.FC<AchievementButtonProps> = ({ onClick }) => {
  const handleClick = async () => {
    await AudioController.playUISound('hover')
    onClick()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="px-4 py-2 bg-secondary/80 hover:bg-secondary text-foreground rounded-lg transition-colors"
    >
      成就图鉴
    </motion.button>
  )
} 