import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chapter } from '../game/state/gameSlice'
import { AudioController } from '../game/controllers/AudioController'

interface ChapterTransitionProps {
  isVisible: boolean
  chapter: Chapter
  previousChapter: Chapter | null
  onAnimationComplete?: () => void
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  isVisible,
  chapter,
  previousChapter,
  onAnimationComplete
}) => {
  useEffect(() => {
    if (isVisible) {
      AudioController.playUISound('select')
    }
  }, [isVisible])

  const getChapterTitle = (chapter: Chapter) => {
    switch (chapter) {
      case 'fog-city':
        return '第一章：迷雾之城'
      case 'mirror-desert':
        return '第二章：镜像沙漠'
      case 'mechanical-dream':
        return '第三章：机械梦境'
      case 'awakening':
        return '终章：觉醒'
      default:
        return '未知章节'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => onAnimationComplete?.()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-primary mb-4">
              {getChapterTitle(chapter)}
            </h1>
            <p className="text-foreground/60">
              正在加载...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 