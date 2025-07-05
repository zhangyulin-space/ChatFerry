import React from 'react'
import { motion } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface MainMenuProps {
  onStartGame: () => void
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const handleStartGame = () => {
    AudioController.playUISound('select')
    onStartGame()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-primary mb-4">语渡--意识探索之旅</h1>
        <p className="text-xl text-foreground/60">意识探索之旅</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="space-y-4"
      >
        <button
          onClick={handleStartGame}
          onMouseEnter={() => AudioController.playUISound('hover')}
          className="px-8 py-3 bg-primary/20 text-primary rounded-lg
                   hover:bg-primary/30 transition-colors text-lg"
        >
          开始探索
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 text-sm text-foreground/40"
      >
        按任意键开始
      </motion.div>
    </div>
  )
} 