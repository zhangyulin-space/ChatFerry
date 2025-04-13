import React from 'react'
import { motion } from 'framer-motion'

interface CharacterInfoProps {
  isVisible: boolean
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({ isVisible }) => {
  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-white"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        {/* Character info content */}
      </div>
    </motion.div>
  )
}

export default CharacterInfo 