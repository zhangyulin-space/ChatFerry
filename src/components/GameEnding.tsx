import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setGameStatus } from '../game/state/gameSlice'
import { AudioController } from '../game/controllers/AudioController'
import styles from '../styles/GameEnding.module.css'

interface GameEndingProps {
  onRestart?: () => void
}

const GameEnding: React.FC<GameEndingProps> = ({ onRestart }) => {
  const dispatch = useDispatch()
  const [currentStanza, setCurrentStanza] = useState(0)
  const [showPoem, setShowPoem] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  const poem = [
    "穿越迷雾的重重帷幕，",
    "你寻找着真实的自我。",
    "在镜像的无尽反射中，",
    "发现了心灵的深度。",
    "",
    "机械的精密与梦境的柔软，",
    "在你的思考中融合。",
    "觉醒不是终点，",
    "而是新的开始。",
    "",
    "每一次选择都是成长，",
    "每一次对话都是力量。",
    "在心灵的深处，",
    "你找到了永恒的勇气。",
    "",
    "愿你带着这份觉醒，",
    "继续前行的路程。",
    "无论前方多少挑战，",
    "你的内心已经坚强。"
  ]

  const encouragementMessage = `
亲爱的旅者，

你已经完成了一场心灵的史诗之旅。从迷雾城的混沌中觉醒，在镜像沙漠中直面自我，于机械梦境中探索意识的边界，最终在觉醒之境找到了真正的自己。

这趟旅程告诉我们：真正的成长不在于外在的成就，而在于内心的觉醒。每一次困惑都是理解的开始，每一次选择都是成长的机会。

现在，请带着这份来自内心深处的力量，继续你在现实世界中的冒险。记住，你拥有着面对任何挑战的勇气和智慧。

愿你的每一天都充满着觉醒的光芒！
  `

  useEffect(() => {
    // 播放结束音乐
    AudioController.stopBgm()
    AudioController.playBgm('transcendence')

    // 逐步显示内容
    const timer1 = setTimeout(() => setShowPoem(true), 1000)
    const timer2 = setTimeout(() => setShowMessage(true), 8000)
    const timer3 = setTimeout(() => setShowButtons(true), 12000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  useEffect(() => {
    if (showPoem) {
      const timer = setInterval(() => {
        setCurrentStanza((prev) => {
          if (prev < poem.length - 1) {
            return prev + 1
          } else {
            clearInterval(timer)
            return prev
          }
        })
      }, 300)

      return () => clearInterval(timer)
    }
  }, [showPoem])

  const handleRestart = () => {
    AudioController.stopBgm()
    if (onRestart) {
      onRestart()
    } else {
      dispatch(setGameStatus('menu'))
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black z-50">
      {/* 固定在顶部的标题 */}
      <div className="fixed top-8 left-0 right-0 text-center z-60">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          觉醒之旅
        </h1>
        <h2 className="text-2xl text-purple-200">
          - 心灵探索的史诗终章 -
        </h2>
      </div>

      {/* 内容区域 */}
      <div className="flex items-center justify-center p-8 pt-32 min-h-screen">
        <div className="max-w-4xl w-full text-center">

        {/* 诗歌部分 */}
        {showPoem && (
          <div className="mt-8 mb-12 p-8 bg-black bg-opacity-30 rounded-xl backdrop-blur-sm">
            <div className="text-lg leading-relaxed text-purple-100 font-serif">
              {poem.slice(0, currentStanza + 1).map((line, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index <= currentStanza ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: `${index * 0.3}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 鼓励话语 */}
        {showMessage && (
          <div className={`mb-8 p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl backdrop-blur-sm opacity-0 ${styles.fadeInUp}`}>
            <div className="text-purple-100 leading-relaxed whitespace-pre-line text-left">
              {encouragementMessage}
            </div>
          </div>
        )}

        {/* 按钮区域 */}
        {showButtons && (
          <div className={`flex justify-center space-x-6 opacity-0 ${styles.fadeInUp}`}>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              重新开始旅程
            </button>
            <button
              onClick={() => window.close()}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              带着觉醒离开
            </button>
          </div>
        )}

        </div>
      </div>

      {/* 闪烁的光点效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default GameEnding 