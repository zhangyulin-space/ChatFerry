import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement, AchievementController } from '../game/controllers/AchievementController'

interface AchievementGalleryProps {
  isVisible: boolean
  onClose: () => void
  achievements: Achievement[]
}

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({
  isVisible,
  onClose,
  achievements
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    if (isVisible) {
      // Any initialization if needed
    }
  }, [isVisible])

  const formatUnlockTime = (timestamp: number | null): string => {
    if (!timestamp) return '未解锁'
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-slate-900 rounded-xl shadow-xl w-full max-w-4xl p-6 m-4 max-h-[80vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">成就图鉴</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                关闭
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto p-2">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className={`relative rounded-lg p-4 cursor-pointer transition-all ${
                    achievement.unlockedAt
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-slate-800/50 hover:bg-slate-800/60'
                  }`}
                  onClick={() => setSelectedAchievement(achievement)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {achievement.unlockedAt ? achievement.icon : '❓'}
                    </span>
                    <div>
                      <h3 className={`font-bold ${
                        achievement.unlockedAt ? 'text-white' : 'text-slate-500'
                      }`}>
                        {achievement.unlockedAt ? achievement.title : '???'}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlockedAt ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {achievement.unlockedAt
                          ? achievement.description
                          : '继续探索以解锁该成就'}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-slate-500 mt-1">
                          解锁时间：{formatUnlockTime(achievement.unlockedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {selectedAchievement && (
                <motion.div
                  className="fixed inset-0 z-60 flex items-center justify-center bg-black/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedAchievement(null)}
                >
                  <motion.div
                    className="bg-slate-800 rounded-lg p-6 max-w-lg w-full m-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl">{selectedAchievement.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {selectedAchievement.title}
                        </h3>
                        <p className="text-slate-300">
                          {selectedAchievement.description}
                        </p>
                      </div>
                    </div>
                    {selectedAchievement.unlockedAt && (
                      <p className="text-sm text-slate-400">
                        解锁于：{formatUnlockTime(selectedAchievement.unlockedAt)}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 