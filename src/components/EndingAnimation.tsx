import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EndingType } from '../game/controllers/EndingController'

interface EndingAnimationProps {
  isVisible: boolean
  endingType: EndingType
  onAnimationComplete: () => void
}

const endingAnimationConfig = {
  transcendence: {
    bgColor: 'from-indigo-900 via-purple-800 to-violet-900',
    particleCount: 150,
    particleColor: 'bg-white',
    glowColor: 'bg-indigo-500',
    title: '超越：无限意识',
    subtitle: '在无限中找到永恒'
  },
  return: {
    bgColor: 'from-emerald-900 via-green-800 to-teal-900',
    particleCount: 100,
    particleColor: 'bg-green-200',
    glowColor: 'bg-emerald-500',
    title: '回归：独立意识',
    subtitle: '带着觉醒回到现实'
  },
  fusion: {
    bgColor: 'from-amber-900 via-orange-800 to-rose-900',
    particleCount: 120,
    particleColor: 'bg-amber-200',
    glowColor: 'bg-orange-500',
    title: '融合：平衡意识',
    subtitle: '在对立中寻得和谐'
  }
}

export const EndingAnimation: React.FC<EndingAnimationProps> = ({
  isVisible,
  endingType,
  onAnimationComplete
}) => {
  const config = endingAnimationConfig[endingType]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onAnimationComplete}
        >
          {/* Background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${config.bgColor}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: config.particleCount }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${config.particleColor}`}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Central Glow */}
          <motion.div
            className={`absolute ${config.glowColor} rounded-full filter blur-3xl`}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: 400,
              height: 400,
              opacity: 0.3
            }}
            transition={{ duration: 2 }}
          />

          {/* Title */}
          <div className="relative text-center z-10">
            <motion.h1
              className="text-4xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {config.title}
            </motion.h1>
            <motion.p
              className="text-xl text-white/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {config.subtitle}
            </motion.p>
          </div>

          {/* Completion Mask */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6, duration: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
} 