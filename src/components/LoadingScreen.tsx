import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  progress: number
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mb-4"
        />
        <p className="text-lg text-foreground/60">加载中... {progress}%</p>
      </motion.div>
    </div>
  )
} 