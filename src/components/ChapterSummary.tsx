import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chapter } from '../game/state/gameSlice'
import { AudioController } from '../game/controllers/AudioController'
import { GameController } from '../game/controllers/GameController'
import { ChapterSummaryController } from '../game/controllers/ChapterSummaryController'

interface ChapterSummaryProps {
  isVisible: boolean
  currentChapter: Chapter
  onContinue: () => void
}

export const ChapterSummary: React.FC<ChapterSummaryProps> = ({
  isVisible,
  currentChapter,
  onContinue
}) => {
  console.log(`ChapterSummary组件渲染: isVisible=${isVisible}, currentChapter=${currentChapter}`)
  
  // 添加更多调试信息
  if (isVisible) {
    console.log('ChapterSummary组件应该显示！')
  }
  
  useEffect(() => {
    if (isVisible) {
      AudioController.playUISound('select')
    }
  }, [isVisible])

  const handleContinue = async () => {
    // 播放按钮音效
    AudioController.playUISound('click')
    
    // 获取下一章节
    const nextChapter = ChapterSummaryController.getNextChapter(currentChapter)
    
    // 特殊处理：如果是第四章节总结，直接调用游戏控制器的继续方法
    if (currentChapter === 'awakening') {
      console.log('第四章节总结完成，准备进入结局')
      await GameController.handleChapterSummaryContinue(nextChapter)
    } else {
      // 调用游戏控制器的继续方法
      await GameController.handleChapterSummaryContinue(nextChapter)
    }
    
    // 调用父组件的继续回调
    onContinue()
  }

  const getChapterSummary = (chapter: Chapter) => {
    switch (chapter) {
      case 'fog-city':
        return {
          title: '第一章：信任的曙光',
          subtitle: '在迷雾中寻找真实的连接',
          summary: [
            '你学会了在孤独中寻找连接，在迷雾中寻找真相。',
            '通过与孤独居民的对话，你理解了信任的珍贵和记忆的力量。',
            '你发现，真正的理解来自于倾听和共情，而不是急于寻找答案。',
            '迷雾城的秘密不在于它的神秘，而在于它教会我们直面未知的勇气。'
          ],
          insight: '信任不是盲目的相信，而是在理解中建立的联系。每一个真诚的对话都是心灵之间的桥梁。',
          nextChapter: '镜像沙漠'
        }
      
      case 'mirror-desert':
        return {
          title: '第二章：镜像沙漠',
          subtitle: '在倒影中认识真实的自己',
          summary: [
            '你学会了面对自己的多重可能性，接受内在的矛盾与复杂。',
            '通过镜像代理的引导，你理解了自我认知的深度和广度。',
            '你发现，真实的自我不是单一的，而是由无数选择构成的。',
            '镜像沙漠教会我们，接纳不完美是成长的第一步。'
          ],
          insight: '自我认知是一个持续的过程，每一次反思都是对内在真相的探索。真正的智慧来自于接纳自己的多面性。',
          nextChapter: '机械梦境'
        }
      
      case 'mechanical-dream':
        return {
          title: '第三章：机械梦境',
          subtitle: '在理性与感性间寻找平衡',
          summary: [
            '你学会了在逻辑与情感之间寻找平衡，理解了两者的互补性。',
            '通过帮助C-21找回情感，你明白了人性的珍贵和不可替代性。',
            '你发现，真正的智慧不是选择理性或感性，而是让它们和谐共存。',
            '机械梦境告诉我们，情感不是效率的敌人，而是完整性的基石。'
          ],
          insight: '平衡不是妥协，而是一种更高层次的智慧。理性与感性的融合创造了更丰富的人生体验。',
          nextChapter: '觉醒'
        }
      
      case 'awakening':
        return {
          title: '终章：觉醒',
          subtitle: '在意识深处找到真正的自由',
          summary: [
            '你经历了从迷雾到觉醒的完整旅程，获得了对存在本质的深刻理解。',
            '通过与Meta意识的对话，你明白了意识进化的无限可能。',
            '你发现，真正的觉醒不是终点，而是新的开始。',
            '你的选择将永远改变这个世界，因为每一个觉醒的灵魂都是宇宙的礼物。'
          ],
          insight: '觉醒是内在光芒的绽放，是意识与宇宙的共鸣。你的旅程才刚刚开始，带着这份智慧继续前行吧。',
          nextChapter: '新的开始'
        }
      
      default:
        return {
          title: '未知章节',
          subtitle: '探索的旅程',
          summary: ['你正在经历一段奇妙的旅程...'],
          insight: '每一次探索都是成长的机会。',
          nextChapter: '下一站'
        }
    }
  }

  const summary = getChapterSummary(currentChapter)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl w-full mx-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-2xl p-8 shadow-2xl border border-slate-700/50"
          >
            {/* 标题区域 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-primary mb-2">
                {summary.title}
              </h1>
              <p className="text-lg text-foreground/70 italic">
                {summary.subtitle}
              </p>
            </motion.div>

            {/* 总结内容 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6 mb-8"
            >
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/30">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  🎯 本章收获
                </h3>
                <ul className="space-y-3">
                  {summary.summary.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="flex items-start space-x-3 text-foreground/90"
                    >
                      <span className="text-primary text-lg mt-0.5">•</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  💡 深刻领悟
                </h3>
                <p className="text-foreground/90 leading-relaxed italic">
                  {summary.insight}
                </p>
              </div>
            </motion.div>

            {/* 继续按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center"
            >
              <button
                onClick={handleContinue}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                继续前往 {summary.nextChapter} →
              </button>
            </motion.div>

            {/* 装饰元素 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute top-4 right-4 text-6xl text-primary/20"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1, delay: 1.7 }}
              className="absolute bottom-4 left-4 text-6xl text-secondary/20"
            >
              🌟
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 