import React from 'react'
import { motion } from 'framer-motion'
import { Chapter } from '../game/state/gameSlice'

interface StatusBarProps {
  chapter: Chapter
  trustLevel: number
  awakeningLevel: number
}

export const StatusBar: React.FC<StatusBarProps> = ({ chapter, trustLevel, awakeningLevel }) => {
  const getChapterName = (chapter: Chapter) => {
    switch (chapter) {
      case 'fog-city':
        return '迷雾城'
      case 'mirror-desert':
        return '镜像沙漠'
      case 'mechanical-dream':
        return '机械梦境'
      case 'awakening':
        return '觉醒'
      default:
        return '未知章节'
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-4" style={{ zIndex: 10 }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium text-lg">章节：{getChapterName(chapter)}</span>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-80">信任度</span>
              <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(trustLevel / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm">{trustLevel.toFixed(1)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-80">觉醒度</span>
              <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(awakeningLevel / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm">{awakeningLevel.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 