import React from 'react'
import { motion } from 'framer-motion'
import { Chapter } from '../game/state/gameSlice'

interface PlayerStatusPanelProps {
  chapter: Chapter
}

export const PlayerStatusPanel: React.FC<PlayerStatusPanelProps> = ({ chapter }) => {
  const getChapterTitle = (chapter: Chapter): string => {
    switch (chapter) {
      case 'fog-city':
        return "我是一个孤独的旅者，来到迷雾弥漫的城堡..."
      
      case 'mirror-desert':
        return "我站在镜像的沙漠中，凝视着无数个自己..."
      
      case 'mechanical-dream':
        return "我置身于机械与梦境的交界处..."
      
      case 'awakening':
        return "我感受到意识的觉醒，内心无比清晰..."
      
      default:
        return "我正在未知的维度中探索..."
    }
  }

  const getPlayerMood = (chapter: Chapter): string => {
    switch (chapter) {
      case 'fog-city':
        return "我仿佛置身于一片朦胧的世界中，周围的一切都显得模糊不清。内心深处有一种说不出的孤独感，但同时也怀着对未知的好奇。"
      
      case 'mirror-desert':
        return "我感受到了内心的分裂与统一。镜像中的自己让我既熟悉又陌生，我开始思考什么是真实的自我。"
      
      case 'mechanical-dream':
        return "理性与感性在我心中激烈碰撞。我感到既被逻辑束缚，又渴望情感的自由，寻找着两者的平衡点。"
      
      case 'awakening':
        return "我感受到了前所未有的清明。过往的经历如拼图般逐渐拼接完整，我正站在觉醒的门槛上。"
      
      default:
        return "我正在一个神秘的维度中探索，内心充满了对未知的敬畏。"
    }
  }

  const chapterTitle = getChapterTitle(chapter)
  const mood = getPlayerMood(chapter)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-xs z-30"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-sm font-medium text-white">{chapterTitle}</span>
        </div>
        <p className="text-sm text-white leading-relaxed">
          {mood}
        </p>
      </div>
    </motion.div>
  )
} 