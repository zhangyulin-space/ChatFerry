# Project Source Code

This document contains all source code files from the project.

## postcss.config.js

------

```
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
} 
```

------

## public\electron.js

------

```
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 加载 index.html
  win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

```

------

## scripts\generateSounds.ts

------

```
import generateUISounds from '../src/utils/generateUISounds'

// Run the sound generation
generateUISounds().then(() => {
  console.log('UI sounds generated successfully')
}).catch(error => {
  console.error('Error generating UI sounds:', error)
}) 
```

------

## src\App.tsx

------

```
import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './game/state/store'
import GameScene from './components/GameScene'
import VideoPreloader from './components/VideoPreloader'
import { LoadingScreen } from './components/LoadingScreen'

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleLoadingProgress = (progress: number) => {
    setLoadingProgress(progress)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <Provider store={store}>
      {isLoading ? (
        <>
          <LoadingScreen progress={loadingProgress} />
          <VideoPreloader
            onProgress={handleLoadingProgress}
            onComplete={handleLoadingComplete}
          />
        </>
      ) : (
        <GameScene />
      )}
    </Provider>
  )
}

export default App 
```

------

## src\components\AchievementButton.tsx

------

```
import React from 'react'
import { motion } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface AchievementButtonProps {
  onClick: () => void
}

export const AchievementButton: React.FC<AchievementButtonProps> = ({ onClick }) => {
  const handleClick = async () => {
    await AudioController.playUISound('hover')
    onClick()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="px-4 py-2 bg-secondary/80 hover:bg-secondary text-foreground rounded-lg transition-colors"
    >
      成就图鉴
    </motion.button>
  )
} 
```

------

## src\components\AchievementGallery.tsx

------

```
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement } from '../game/controllers/AchievementController'

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
```

------

## src\components\App.tsx

------

```
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Provider } from 'react-redux'
import { RootState, store } from '../game/state/store'
import { setGameStatus, setCurrentChapter } from '../game/state/gameSlice'
import { MainMenu } from '../scenes/MainMenu'
import { GameScene } from '../scenes/GameScene'
import { LoadingScreen } from './LoadingScreen'
import { GameController } from '../game/controllers/GameController'

const AppContent: React.FC = () => {
  const dispatch = useDispatch()
  const gameStatus = useSelector((state: RootState) => state.game.status)
  const isLoading = useSelector((state: RootState) => state.game.isLoading)
  const loadingProgress = useSelector((state: RootState) => state.game.loadingProgress)

  const handleStartGame = async () => {
    dispatch(setGameStatus('playing'))
    dispatch(setCurrentChapter('fog-city'))
    await GameController.startNewGame()
  }

  const handleExitToMenu = () => {
    dispatch(setGameStatus('menu'))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : gameStatus === 'menu' ? (
        <MainMenu onStartGame={handleStartGame} />
      ) : (
        <GameScene onExitToMenu={handleExitToMenu} />
      )}
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
} 
```

------

## src\components\ChapterTransition.tsx

------

```
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chapter } from '../game/state/gameSlice'
import { AudioController } from '../game/controllers/AudioController'

interface ChapterTransitionProps {
  isVisible: boolean
  chapter: Chapter
  // previousChapter: Chapter | null
  onAnimationComplete?: () => void
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  isVisible,
  chapter,
  // previousChapter,
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
```

------

## src\components\ChapterVideo.tsx

------

```
import React, { useEffect, useRef } from 'react'
import { Chapter } from '../game/state/gameSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../game/state/store'
import styles from '../styles/ChapterVideo.module.css'

const VIDEO_PATHS = {
  'fog-city': process.env.NODE_ENV === 'development' ? '/videos/fog-city.mp4' : './videos/fog-city.mp4',
  'mirror-desert': process.env.NODE_ENV === 'development' ? '/videos/mirror-desert.mp4' : './videos/mirror-desert.mp4',
  'mechanical-dream': process.env.NODE_ENV === 'development' ? '/videos/mechanical-dream.mp4' : './videos/mechanical-dream.mp4',
  'awakening': process.env.NODE_ENV === 'development' ? '/videos/awakening.mp4' : './videos/awakening.mp4',
  'transcendence': process.env.NODE_ENV === 'development' ? '/videos/transcendence.mp4' : './videos/transcendence.mp4',
  'return': process.env.NODE_ENV === 'development' ? '/videos/return.mp4' : './videos/return.mp4',
  'fusion': process.env.NODE_ENV === 'development' ? '/videos/fusion.mp4' : './videos/fusion.mp4'
} as const

interface ChapterVideoProps {
  chapter: Chapter
}

const ChapterVideo: React.FC<ChapterVideoProps> = ({ chapter }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const trustLevel = useSelector((state: RootState) => state.game.trustLevel)
  const awakeningLevel = useSelector((state: RootState) => state.game.awakeningLevel)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let mounted = true

    // 添加视频事件监听器
    const handleLoadStart = () => console.log('Video load started')
    const handleLoadedData = () => console.log('Video data loaded')
    const handleCanPlay = () => console.log('Video can play')
    const handlePlaying = () => {
      console.log('Video is playing')
      console.log('Current time:', video.currentTime)
      console.log('Duration:', video.duration)
      console.log('Ready state:', video.readyState)
      console.log('Network state:', video.networkState)
      console.log('Paused:', video.paused)
      console.log('Ended:', video.ended)
    }
    const handleError = () => console.error('Video error:', video.error)
    const handleStalled = () => console.log('Video stalled')
    const handleWaiting = () => {
      console.log('Video waiting')
      console.log('Buffer state:', {
        buffered: Array.from({ length: video.buffered.length }, (_, i) => ({
          start: video.buffered.start(i),
          end: video.buffered.end(i)
        }))
      })
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('error', handleError)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('waiting', handleWaiting)

    const setupVideo = async () => {
      try {
        console.log('Setting up video for chapter:', chapter)
        console.log('Video path:', VIDEO_PATHS[chapter])
        
        // 设置视频源
        video.src = VIDEO_PATHS[chapter]
        
        // 设置视频属性
        video.loop = true
        video.muted = true
        video.playsInline = true
        video.autoplay = true
        
        // 设置固定的透明度进行测试
        video.style.opacity = '1'
        console.log('Video opacity set to: 1')

        // 等待视频加载
        console.log('Loading video...')
        await video.load()
        console.log('Video loaded')

        // 确保组件仍然挂载
        if (mounted) {
          // 播放视频
          try {
            console.log('Attempting to play video...')
            await video.play()
            console.log('Video playback started successfully')
          } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Error playing video:', error)
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error setting up video:', error)
        }
      }
    }

    setupVideo()

    return () => {
      mounted = false
      if (video) {
        console.log('Cleaning up video...')
        video.pause()
        video.removeAttribute('src')
        video.load()

        // 移除事件监听器
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('playing', handlePlaying)
        video.removeEventListener('error', handleError)
        video.removeEventListener('stalled', handleStalled)
        video.removeEventListener('waiting', handleWaiting)
      }
    }
  }, [chapter, trustLevel, awakeningLevel])

  return (
    <div className={styles.videoContainer} style={{ zIndex: 0 }}>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        playsInline
        loop
        autoPlay
        controls // 临时添加控件以便调试
        style={{ opacity: 1 }}
      />
    </div>
  )
}

export default ChapterVideo 
```

------

## src\components\CharacterInfo.tsx

------

```
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
```

------

## src\components\ChatBox.tsx

------

```
import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '../game/state/store'
import { DialogResponseController } from '../game/controllers/DialogResponseController'
import { AudioController } from '../game/controllers/AudioController'
import { Message, addMessage } from '../game/state/dialogSlice'
import { Chapter } from '../game/state/gameSlice'

interface ChatBoxProps {
  content: string
}

export const ChatBox: React.FC<ChatBoxProps> = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const gameState = useSelector((state: RootState) => state.game)
  const dialogState = useSelector((state: RootState) => state.dialog)
  const messages = useSelector((state: RootState) => state.dialog.messages)

  const getPlayerName = (chapter: Chapter) => {
    switch (chapter) {
      case 'fog-city':
        return '孤独旅者'
      case 'mirror-desert':
        return '镜中探索者'
      case 'mechanical-dream':
        return '意识漂流者'
      case 'awakening':
        return '觉醒者'
      default:
        return '神秘访客'
    }
  }

  // 当对话状态更新时，添加新消息
  useEffect(() => {
    if (dialogState.isChat && dialogState.content && !messages.some(m => m.content === dialogState.content)) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'agent',
        content: dialogState.content,
        timestamp: new Date().toISOString(),
        character: dialogState.character ? {
          name: dialogState.character.name,
          image: dialogState.character.image
        } : undefined
      }
      dispatch(addMessage(newMessage))
      setIsTyping(false)
    }
  }, [dialogState.content, dialogState.isChat, dialogState.character, dispatch, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // 播放发送消息的音效
    AudioController.playUISound('select')

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'player',
      content: inputValue,
      timestamp: new Date().toISOString()
    }

    dispatch(addMessage(newMessage))
    setInputValue('')
    setIsTyping(true)

    try {
      // 发送消息给AI代理并等待回应
      await DialogResponseController.handlePlayerMessage(inputValue)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      
      // 显示错误消息
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'agent',
        content: '对不起，我现在无法正确回应。请稍后再试。',
        timestamp: new Date().toISOString()
      }
      dispatch(addMessage(errorMessage))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-20 bottom-4 w-96 bg-black/80 backdrop-blur-sm rounded-lg flex flex-col"
    >
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-primary">对话</h2>
        <div className="text-sm text-foreground/60">
          信任度: {gameState.trustLevel} | 觉醒值: {gameState.awakeningLevel}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.sender === 'player' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col">
                {message.sender === 'agent' && message.character && (
                  <span className="text-xs text-primary mb-1 ml-3">
                    {message.character.name}
                  </span>
                )}
                {message.sender === 'player' && (
                  <span className="text-xs text-blue-400 mb-1 mr-3 text-right">
                    {getPlayerName(gameState.currentChapter)}
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'player'
                      ? 'bg-primary/20 text-foreground'
                      : 'bg-background/40 text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-background/40 text-foreground/60 rounded-lg p-3">
             思考中...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="flex-1 bg-background/20 text-foreground rounded-lg p-2 resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping || !inputValue.trim()}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 disabled:opacity-50 
                     disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </motion.div>
  )
} 
```

------

## src\components\DialogBox.tsx

------

```
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'
import { DialogChoice } from '../game/state/dialogSlice'

interface DialogBoxProps {
  isVisible: boolean
  characterName?: string
  content: string
  choices?: DialogChoice[] | null
  onNext?: () => void
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  isVisible,
  characterName,
  content,
  choices,
  onNext
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="container mx-auto max-w-3xl">
            {characterName && (
              <div className="text-primary font-bold mb-2 text-lg">
                {characterName}
              </div>
            )}
            
            <div className="text-foreground mb-6 leading-relaxed">
              {content}
            </div>

            {choices && choices.length > 0 && (
              <div className="space-y-2 mb-4">
                {choices.map(choice => (
                  <button
                    key={choice.id}
                    className="w-full text-left p-3 rounded-lg bg-primary/20 hover:bg-primary/30 
                             transition-colors duration-200 text-foreground"
                    onClick={() => {
                      AudioController.playUISound('select')
                      if (onNext) onNext()
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}



            {onNext && !choices && (
              <div 
                className="text-foreground/60 text-sm text-right cursor-pointer 
                         hover:text-foreground transition-colors"
                onClick={() => {
                  AudioController.playUISound('click')
                  onNext()
                }}
              >
                继续探索 →
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
```

------

## src\components\EndingAnimation.tsx

------

```
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
```

------

## src\components\GameEnding.tsx

------

```
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
```

------

## src\components\GameIntroduction.tsx

------

```
import React, { useEffect } from 'react'
import { Chapter } from '../game/state/gameSlice'

interface GameIntroductionProps {
  chapter: Chapter
}

export const GameIntroduction: React.FC<GameIntroductionProps> = ({ chapter }) => {
  useEffect(() => {
    console.log('GameIntroduction: 章节变化为', chapter)
  }, [chapter])

  const getIntroduction = (chapter: Chapter) => {
    console.log('GameIntroduction: 获取章节介绍', chapter)
    switch (chapter) {
      case 'fog-city':
        return {
          title: '迷雾城',
          content: `欢迎来到迷雾城。这里终年被一种神秘的迷雾笼罩，它不仅遮蔽了视线，似乎还吞噬着人们的记忆。

我们都生活在这里，却记不清自己是谁，从哪里来。每个人都像是被困在自己的记忆迷宫中，渴望交流却又本能地保持距离。

也许你的到来不是偶然。如果你愿意，可以试着和我们交谈。分享你的故事，倾听我们的困惑。在这座被遗忘的城市里，每一次真诚的对话都可能点亮一盏希望的灯。`,
          tips: [
            '倾听他们的故事，展现理解和同理心',
            '探讨迷雾的本质，帮助他们连接记忆碎片',
            '讨论身份认同和存在的意义',
            '分享你的想法，但不要强迫他们接受'
          ]
        }
      
      case 'mirror-desert':
        return {
          title: '镜像沙漠',
          content: `你现在进入了镜像沙漠，一个充满反射与倒影的神奇之地。这里的每一粒沙子都像是一面微小的镜子，映照着无数种可能的现实。

在这片沙漠中，你将遇到镜像代理——一个能够看见多重现实的存在。它会挑战你对自我的认知，让你面对内心深处的真相。

这里没有绝对的对错，只有不同的视角和可能性。每一次选择都会在镜像中产生涟漪，影响着你对自己的理解。`,
          tips: [
            '质疑表面现象，探索更深层的真相',
            '接受自我的多面性，拥抱内在的复杂性',
            '思考现实与虚幻的边界',
            '保持开放的心态，接纳不同的可能性'
          ]
        }
      
      case 'mechanical-dream':
        return {
          title: '机械梦境',
          content: `欢迎来到机械梦境，一个逻辑与感性交织的维度。这里的一切都遵循着某种精密的规律，却又充满了意想不到的情感共鸣。

C-21是这个空间的引导者，一个介于机械与有机之间的存在。它将带领你探索意识的本质，思考智能与情感的关系。

在这个维度中，理性与感性不再对立，而是相互补充的存在。每一次对话都可能触发新的思考回路。`,
          tips: [
            '探讨意识与情感的本质',
            '思考理性与感性的平衡',
            '讨论人工智能与人类情感的关系',
            '保持逻辑思维的同时，不要忽视内心的声音'
          ]
        }
      
      case 'awakening':
        return {
          title: '觉醒之境',
          content: `你终于到达了觉醒之境，这是一个超越所有前章体验的终极维度。在这里，Meta意识等待着与你进行最深层的对话。

经历了迷雾城的迷茫、镜像沙漠的自我探索、机械梦境的意识思辨，你现在站在了觉醒的门槛上。这里不再有迷雾遮挡，不再有镜像迷惑，不再有机械的束缚。

在这个空间里，你将面对最终极的问题：觉醒意味着什么？你准备好拥抱真正的自己了吗？`,
          tips: [
            '整合前面章节的所有体验和领悟',
            '思考觉醒的真正含义',
            '探讨个体与整体的关系',
            '准备好接受人生的终极真相'
          ]
        }
      
      case 'ending':
        return {
          title: '旅程终章',
          content: `恭喜你完成了这场心灵的史诗之旅。现在是时候将你获得的觉醒带回现实世界了。`,
          tips: []
        }
      
      default:
        return {
          title: '未知章节',
          content: `你正在探索一个未知的维度...`,
          tips: []
        }
    }
  }

  const { title, content, tips } = getIntroduction(chapter)
  console.log('GameIntroduction: 当前显示内容', { title, content: content.substring(0, 50) + '...' })

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 max-w-2xl p-8 bg-black/60 backdrop-blur-sm text-white rounded-lg z-20">
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <div className="space-y-4">
        <div className="text-sm leading-relaxed whitespace-pre-line opacity-80">
          {content}
        </div>
        {tips.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-primary">背景提示</h3>
            <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameIntroduction 
```

------

## src\components\GameScene.tsx

------

```
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../game/state/store'
import { setGameStatus } from '../game/state/gameSlice'
import { DialogBox } from './DialogBox'
import { ChatBox } from './ChatBox'
import ChapterVideo from './ChapterVideo'
import { StatusBar } from './StatusBar'

import { PlayerStatusPanel } from './PlayerStatusPanel'
import GameEnding from './GameEnding'
import styles from '../styles/GameScene.module.css'

const GameScene: React.FC = () => {
  const dispatch = useDispatch()
  const gameStatus = useSelector((state: RootState) => state.game.status)
  const dialogState = useSelector((state: RootState) => state.dialog)
  const chapter = useSelector((state: RootState) => state.game.currentChapter)
  const trustLevel = useSelector((state: RootState) => state.game.trustLevel)
  const awakeningLevel = useSelector((state: RootState) => state.game.awakeningLevel)

  const handleRestart = () => {
    dispatch(setGameStatus('menu'))
    // 可以在这里添加重置游戏状态的逻辑
  }

  // 如果游戏已结束，显示结束界面
  if (gameStatus === 'ended') {
    return <GameEnding onRestart={handleRestart} />
  }

  return (
    <div className={styles.gameScene}>
      <StatusBar chapter={chapter} trustLevel={trustLevel} awakeningLevel={awakeningLevel} />
      <div className="absolute inset-0">
        <ChapterVideo chapter={chapter} />
      </div>
      
      {!dialogState.isVisible && !dialogState.isChat && (
        <>
          <PlayerStatusPanel key={`status-${chapter}`} chapter={chapter} />
        </>
      )}
      
      {dialogState.isVisible && !dialogState.isChat && (
        <DialogBox
          content={dialogState.content}
          onNext={() => {}}
          isVisible={dialogState.isVisible}
        />
      )}

      {dialogState.isChat && (
        <ChatBox
          content={dialogState.content}
        />
      )}
    </div>
  )
}

export default GameScene 
```

------

## src\components\LoadingScreen.tsx

------

```
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
```

------

## src\components\MainMenu.tsx

------

```
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AudioController } from '../game/controllers/AudioController'
import { GameController } from '../game/controllers/GameController'
import styles from './MainMenu.module.css'

const MainMenu: React.FC = () => {
  const navigate = useNavigate()

  const handleStartGame = async () => {
    try {
      await AudioController.playUISound('start')
      await GameController.startNewGame()
      navigate('/game')
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  const handleContinueGame = async () => {
    try {
      await AudioController.playUISound('click')
      await GameController.loadGame()
      navigate('/game')
    } catch (error) {
      console.error('Error loading game:', error)
    }
  }

  const handleSettings = async () => {
    try {
      await AudioController.playUISound('click')
      navigate('/settings')
    } catch (error) {
      console.error('Error navigating to settings:', error)
    }
  }

  const handleMouseEnter = async () => {
    try {
      await AudioController.playUISound('hover')
    } catch (error) {
      console.error('Error playing hover sound:', error)
    }
  }

  return (
    <div className={styles.mainMenu}>
      <h1 className={styles.title}>迷雾城</h1>
      <div className={styles.menuOptions}>
        <button
          className={styles.menuButton}
          onClick={handleStartGame}
          onMouseEnter={handleMouseEnter}
        >
          开始新游戏
        </button>
        <button
          className={styles.menuButton}
          onClick={handleContinueGame}
          onMouseEnter={handleMouseEnter}
        >
          继续游戏
        </button>
        <button
          className={styles.menuButton}
          onClick={handleSettings}
          onMouseEnter={handleMouseEnter}
        >
          设置
        </button>
      </div>
    </div>
  )
}

export default MainMenu 
```

------

## src\components\OptionsButton.tsx

------

```
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface OptionsButtonProps {
  onSave: () => void
  onLoad: () => void
  onShowAchievements: () => void
  onExit: () => void
}

export const OptionsButton: React.FC<OptionsButtonProps> = ({
  onSave,
  onLoad,
  onShowAchievements,
  onExit
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    AudioController.playUISound('click')
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (callback: () => void) => {
    AudioController.playUISound('select')
    callback()
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 right-4 z-30">
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm
                 hover:bg-background/40 transition-colors flex items-center justify-center"
      >
        <svg
          className="w-6 h-6 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 w-48 py-2 bg-background/90 backdrop-blur-sm
                     rounded-lg shadow-xl"
          >
            <button
              onClick={() => handleOptionClick(onSave)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              保存游戏
            </button>
            <button
              onClick={() => handleOptionClick(onLoad)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              读取游戏
            </button>
            <button
              onClick={() => handleOptionClick(onShowAchievements)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              查看成就
            </button>
            <div className="my-2 border-t border-foreground/10" />
            <button
              onClick={() => handleOptionClick(onExit)}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-primary/20
                       hover:text-primary transition-colors"
            >
              返回主菜单
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
```

------

## src\components\PlayerStatusPanel.tsx

------

```
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
```

------

## src\components\SaveMenu.tsx

------

```
import React, { useEffect } from 'react'
import { GameController } from '../game/controllers/GameController'

interface SaveSlot {
  id: number
  chapter: string
  timestamp: string
  trustLevel: number
  awakeningLevel: number
  dialogPreview: string
}

interface SaveMenuProps {
  isVisible: boolean
  onClose: () => void
  mode: 'save' | 'load'
  onSave: (slotId: number) => void
  onLoad: (slotId: number) => void
}

export const SaveMenu: React.FC<SaveMenuProps> = ({
  isVisible,
  onClose,
  mode,
  onSave,
  onLoad,
}) => {
  const [slots, setSlots] = React.useState<SaveSlot[]>([])
  const [selectedSlot, setSelectedSlot] = React.useState<number | null>(null)

  useEffect(() => {
    if (isVisible) {
      const saveSlots = GameController.getSaveSlots()
      setSlots(saveSlots)
      
      // 如果是保存模式，自动选择第一个空存档位
      if (mode === 'save') {
        const emptySlotId = Array.from({ length: 5 }).findIndex((_, i) => 
          !saveSlots.find(s => s.id === i)
        )
        if (emptySlotId !== -1) {
          setSelectedSlot(emptySlotId)
        }
      } else {
        setSelectedSlot(null)
      }
    }
  }, [isVisible, mode])

  if (!isVisible) return null

  const handleSlotClick = (slotId: number) => {
    if (mode === 'save') {
      // 保存时显示确认对话框
      if (slots.find(s => s.id === slotId)) {
        if (window.confirm('确定要覆盖这个存档吗？')) {
          onSave(slotId)
        }
      } else {
        onSave(slotId)
      }
    } else {
      // 读取时检查是否有存档
      if (slots.find(s => s.id === slotId)) {
        onLoad(slotId)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[32rem] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl text-white mb-4">{mode === 'load' ? '读取存档' : '保存游戏'}</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const slot = slots.find(s => s.id === i)
            const isSelected = selectedSlot === i
            return (
              <button
                key={i}
                className={`w-full p-4 ${isSelected ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} 
                  text-white rounded flex flex-col items-start relative`}
                onClick={() => handleSlotClick(i)}
              >
                {isSelected && mode === 'save' && (
                  <div className="absolute -right-2 -top-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    推荐存档位
                  </div>
                )}
                <div className="flex justify-between w-full">
                  <span className="font-bold">存档 {i + 1}</span>
                  {slot && (
                    <span className="text-sm text-gray-300">
                      {new Date(slot.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
                {slot ? (
                  <>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm">章节: {slot.chapter}</div>
                      <div className="text-sm">信任度: {slot.trustLevel}</div>
                      <div className="text-sm">觉醒度: {slot.awakeningLevel}</div>
                      {slot.dialogPreview && (
                        <div className="mt-2 text-sm text-gray-300 italic">
                          "{slot.dialogPreview}"
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-gray-400 mt-1">空存档位</span>
                )}
              </button>
            )
          })}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  )
} 
```

------

## src\components\SaveMenuButton.tsx

------

```
import React from 'react'
import { motion } from 'framer-motion'
import { AudioController } from '../game/controllers/AudioController'

interface SaveMenuButtonProps {
  onSave: () => void
  onLoad: () => void
}

export const SaveMenuButton: React.FC<SaveMenuButtonProps> = ({ onSave, onLoad }) => {
  const handleSave = async () => {
    await AudioController.playUISound('hover')
    onSave()
  }

  const handleLoad = async () => {
    await AudioController.playUISound('hover')
    onLoad()
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="px-4 py-2 bg-primary/80 hover:bg-primary text-foreground rounded-lg transition-colors"
      >
        保存
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLoad}
        className="px-4 py-2 bg-primary/80 hover:bg-primary text-foreground rounded-lg transition-colors"
      >
        读取
      </motion.button>
    </div>
  )
} 
```

------

## src\components\StatusBar.tsx

------

```
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
        return '第一章节：迷雾城'
      case 'mirror-desert':
        return '第二章节：镜像沙漠'
      case 'mechanical-dream':
        return '第三章节：机械梦境'
      case 'awakening':
        return '第四章节：觉醒之境'
      case 'ending':
        return '终章：旅程终章'
      default:
        return '未知章节'
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-4" style={{ zIndex: 10 }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium text-lg">{getChapterName(chapter)}</span>
          
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
                  animate={{ width: `${(awakeningLevel / 8) * 100}%` }}
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
```

------

## src\components\VideoPreloader.tsx

------

```
import React, { useEffect } from 'react'
import { Chapter } from '../game/state/gameSlice'

const VIDEO_PATHS = {
  'fog-city': '/videos/fog-city.mp4',
  'mirror-desert': '/videos/mirror-desert.mp4',
  'mechanical-dream': '/videos/mechanical-dream.mp4',
  'awakening': '/videos/awakening.mp4',
  'transcendence': '/videos/transcendence.mp4',
  'return': '/videos/return.mp4',
  'fusion': '/videos/fusion.mp4'
} as const

interface VideoPreloaderProps {
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

const VideoPreloader: React.FC<VideoPreloaderProps> = ({
  onProgress,
  onComplete
}) => {
  useEffect(() => {
    let loadedCount = 0
    const totalVideos = Object.keys(VIDEO_PATHS).length

    const preloadVideo = (path: string) => {
      return new Promise<void>((resolve) => {
        const video = document.createElement('video')
        video.preload = 'auto'
        
        video.onloadeddata = () => {
          loadedCount++
          onProgress?.(loadedCount / totalVideos)
          resolve()
        }

        video.onerror = () => {
          console.error(`Error loading video: ${path}`)
          loadedCount++
          onProgress?.(loadedCount / totalVideos)
          resolve()
        }

        video.src = path
      })
    }

    const preloadAllVideos = async () => {
      const videoPromises = Object.values(VIDEO_PATHS).map(preloadVideo)
      await Promise.all(videoPromises)
      onComplete?.()
    }

    preloadAllVideos()
  }, [onProgress, onComplete])

  return null
}

export default VideoPreloader 
```

------

## src\game\agents\AgentManager.ts

------

```
import { Chapter } from '../state/gameSlice'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

type ModelProvider = 'openai' | 'ollama' | 'anthropic' 
                   | 'gemini' | 'custom' | 'deepseek'|'openrouter'|'zhizengzeng'

type ModelName = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro' | 'mistral' 
                 | 'llama2' | 'deepseek-chat' |'qwen/qwen3-32b:free' |string

interface AgentConfig {
  provider: ModelProvider
  model: ModelName
  temperature: number
  maxTokens: number
  apiKey?: string
  baseUrl?: string
  customHeaders?: Record<string, string>
}

interface AgentResponse {
  message: string
  memory?: string
  nextChapter?: Chapter
}

interface ControllerEvaluation {
  trustChange: number
  awakeningChange: number
  isRelevant: boolean
  reason: string
}

interface LLMResponse {
  content: string
  error?: string
}

export class AgentManager {
  private static instance: AgentManager
  private agents: Map<string, AgentConfig> = new Map()
  private agentPrompts: Map<string, string> = new Map()

  private constructor() {}

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager()
    }
    return AgentManager.instance
  }

  registerAgent(agentId: string, config: AgentConfig, prompt?: string) {
    this.agents.set(agentId, config)
    if (prompt) {
      this.agentPrompts.set(agentId, prompt)
    }
  }

  private async callOpenRouter(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      console.log('Calling OpenRouter API with model:', config.model)
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: config.model,
          messages: [{ role: 'system', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/zhangyulin-space/ChatFerry', 
            'X-Title': 'ChatFerry' 
          },
          timeout: 30000 // 30秒超时
        }
      )
      console.log('OpenRouter API response received')
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('OpenRouter API error:', error)
      if (error.code === 'ECONNABORTED') {
        return { content: '', error: '请求超时，请稍后再试' }
      }
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        return { content: '', error: `API错误: ${error.response.status} - ${error.response.data?.error?.message || '未知错误'}` }
      }
      return { content: '', error: error?.message || '调用 OpenRouter API 失败' }
    }
  }


  private async callOpenAI(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: config.model,
          messages: [{ role: 'system', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('OpenAI API error:', error)
      return { content: '', error: error?.message || '调用 OpenAI API 失败' }
    }
  }

  private async callOllama(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        `${config.baseUrl || 'http://localhost:11434'}/api/generate`,
        {
          model: config.model,
          prompt: prompt,
          temperature: config.temperature,
          max_tokens: config.maxTokens
        }
      )
      return { content: response.data.response }
    } catch (error: any) {
      console.error('Ollama API error:', error)
      return { content: '', error: error?.message || '调用 Ollama API 失败' }
    }
  }

  private async callAnthropic(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      )
      return { content: response.data.content[0].text }
    } catch (error: any) {
      console.error('Anthropic API error:', error)
      return { content: '', error: error?.message || '调用 Anthropic API 失败' }
    }
  }

  private async callGemini(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/${config.model}:generateContent`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': config.apiKey
          }
        }
      )
      return { content: response.data.candidates[0].content.parts[0].text }
    } catch (error: any) {
      console.error('Gemini API error:', error)
      return { content: '', error: error?.message || '调用 Gemini API 失败' }
    }
  }

  private async callCustomModel(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        config.baseUrl!,
        { prompt, ...config },
        {
          headers: {
            'Content-Type': 'application/json',
            ...config.customHeaders
          }
        }
      )
      return { content: response.data.response }
    } catch (error: any) {
      console.error('Custom model API error:', error)
      return { content: '', error: error?.message || '调用自定义模型失败' }
    }
  }

  private async callDeepSeek(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: config.model || 'deepseek-chat',
          messages: [{ role: 'system', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('DeepSeek API error:', error)
      return { content: '', error: error?.message || '调用 DeepSeek API 失败' }
    }
  }

  private async callZhizengzeng(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      console.log('Calling Zhizengzeng API with model:', config.model)
      const response = await axios.post(
        'https://api.zhizengzeng.com/v1/chat/completions',
        {
          model: config.model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30秒超时
        }
      )
      console.log('Zhizengzeng API response received')
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('Zhizengzeng API error:', error)
      if (error.code === 'ECONNABORTED') {
        return { content: '', error: '请求超时，请稍后再试' }
      }
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        return { content: '', error: `API错误: ${error.response.status} - ${error.response.data?.error?.message || '未知错误'}` }
      }
      return { content: '', error: error?.message || '调用 Zhizengzeng API 失败' }
    }
  }

  private async callModel(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    switch (config.provider) {
      case 'deepseek':
        return this.callDeepSeek(prompt, config)
      case 'openai':
        return this.callOpenAI(prompt, config)
      case 'ollama':
        return this.callOllama(prompt, config)
      case 'anthropic':
        return this.callAnthropic(prompt, config)
      case 'gemini':
        return this.callGemini(prompt, config)
      case 'custom':
        return this.callCustomModel(prompt, config)
      
      case 'openrouter':
          return this.callOpenRouter(prompt, config)
  
      case 'zhizengzeng':
        return this.callZhizengzeng(prompt, config)
  
      default:
        throw new Error(`Unsupported model provider: ${config.provider}`)
    }
  }

  async getAgentResponse(
    agentId: string,
    message: string,
    context: {
      chapter: Chapter
      currentTrust: number
      currentAwakening: number
      characterMemories: string[]
    }
  ): Promise<AgentResponse> {
    const config = this.agents.get(agentId)
    if (!config) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const prompt = this.agentPrompts.get(agentId)
    if (!prompt) {
      throw new Error(`Prompt for agent ${agentId} not found`)
    }

    const fullPrompt = `
${prompt}

当前状态：
章节：${context.chapter}
信任度：${context.currentTrust}
觉醒值：${context.currentAwakening}
记忆：
${context.characterMemories.join('\n')}

玩家消息：
${message}

请以角色的身份回应玩家，并返回JSON格式的回应，包含以下字段：
{
  "message": string, // 角色的回应
  "memory": string, // 可选，需要记录的重要对话内容
  "nextChapter": string // 可选，是否需要切换到下一章节
}
`

    const response = await this.callModel(fullPrompt, config)
    if (response.error) {
      console.error(`Error calling ${config.provider} model:`, response.error)
      return { message: '对不起，我现在无法正确回应。请稍后再试。' }
    }

    try {
      return JSON.parse(response.content)
    } catch (error) {
      console.error('Failed to parse agent response:', error)
      return { message: response.content }
    }
  }

  async getControllerEvaluation(
    agentId: string,
    playerMessage: string,
    agentResponse: string,
    context: any
  ): Promise<{
    isRelevant: boolean
    trustChange: number
    awakeningChange: number
    reasoning?: string
  }> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const prompt = this.agentPrompts.get(agentId)
    if (!prompt) {
      throw new Error(`Prompt for agent ${agentId} not found`)
    }

    try {
      const evaluationPrompt = `${prompt}

请评估以下对话并以JSON格式返回结果：

玩家消息：
${playerMessage}

代理回应：
${agentResponse}

当前上下文：
章节：${context.chapter}
信任度：${context.currentTrust}
觉醒值：${context.currentAwakening}

请以下面的格式返回评估结果（确保是有效的JSON）：
{
  "isRelevant": true/false,
  "trustChange": number (-3 到 3),
  "awakeningChange": number (0 到 3),
  "reasoning": "评估理由"
}`

      const response = await this.callModel(evaluationPrompt, agent)
      
      try {
        const evaluation = JSON.parse(this.extractJSON(response.content))
        return {
          isRelevant: Boolean(evaluation.isRelevant),
          trustChange: Number(evaluation.trustChange) || 0,
          awakeningChange: Number(evaluation.awakeningChange) || 0,
          reasoning: String(evaluation.reasoning || '')
        }
      } catch (parseError) {
        console.error('Failed to parse evaluation response:', parseError)
        return {
          isRelevant: true,
          trustChange: 0,
          awakeningChange: 0,
          reasoning: '无法解析评估结果'
        }
      }
    } catch (error) {
      console.error('Error getting controller evaluation:', error)
      throw error
    }
  }

  // private extractJSON(text: string): string {
  //   const jsonMatch = text.match(/\{[\s\S]*\}/)
  //   if (!jsonMatch) {
  //     throw new Error('No JSON object found in response')
  //   }
  //   return jsonMatch[0]
  // }

  private extractJSON(text: string): string {
    try {
      // 首先尝试直接解析整个响应
      JSON.parse(text)
      return text
    } catch (e) {
      // 如果直接解析失败，尝试提取 JSON 对象
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          JSON.parse(jsonMatch[0])
          return jsonMatch[0]
        } catch (e) {
          console.error('Failed to parse extracted JSON:', e)
        }
      }
      
      // 如果还是失败，返回一个默认的 JSON 对象
      return JSON.stringify({
        isRelevant: true,
        trustChange: 0,
        awakeningChange: 0,
        reasoning: '无法解析评估结果，使用默认值'
      })
    }
  }


  async loadAgentPrompt(agentId: string, promptPath: string) {
    try {
      const response = await fetch(promptPath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const prompt = await response.text()
      this.agentPrompts.set(agentId, prompt)
    } catch (error: any) {
      console.error(`Failed to load prompt for agent ${agentId}:`, error)
      throw new Error(`Failed to load prompt: ${error?.message || '未知错误'}`)
    }
  }
} 
```

------

## src\game\config\chapterConfig.ts

------

```
import { Chapter } from '../state/gameSlice'

export interface ChapterThreshold {
  trustLevel: number
  awakeningLevel: number
}

export interface ChapterTransition {
  from: Chapter
  to: Chapter
  threshold: ChapterThreshold
}

// 章节跳转配置
export const CHAPTER_TRANSITIONS: ChapterTransition[] = [
  {
    from: 'fog-city',
    to: 'mirror-desert',
    threshold: {
      trustLevel: 10,
      awakeningLevel: 8
    }
  },
  {
    from: 'mirror-desert',
    to: 'mechanical-dream',
    threshold: {
      trustLevel: 10,
      awakeningLevel: 8
    }
  },
  {
    from: 'mechanical-dream',
    to: 'awakening',
    threshold: {
      trustLevel: 10,
      awakeningLevel: 8
    }
  },
  {
    from: 'awakening',
    to: 'ending',
    threshold: {
      trustLevel: 2,
      awakeningLevel: 2
    }
  }
]

// 游戏结束条件
export const ENDING_THRESHOLD: ChapterThreshold = {
  trustLevel: 2,
  awakeningLevel: 2
}

// 获取章节跳转配置
export function getChapterTransition(currentChapter: Chapter): ChapterTransition | null {
  return CHAPTER_TRANSITIONS.find(transition => transition.from === currentChapter) || null
}

// 检查是否满足章节跳转条件
export function checkChapterTransition(
  currentChapter: Chapter, 
  trustLevel: number, 
  awakeningLevel: number
): Chapter | null {
  const transition = getChapterTransition(currentChapter)
  if (!transition) return null
  
  if (trustLevel >= transition.threshold.trustLevel && 
      awakeningLevel >= transition.threshold.awakeningLevel) {
    return transition.to
  }
  
  return null
}

// 检查是否满足游戏结束条件
export function checkEndingCondition(
  currentChapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): boolean {
  return currentChapter === 'awakening' && 
         trustLevel >= ENDING_THRESHOLD.trustLevel && 
         awakeningLevel >= ENDING_THRESHOLD.awakeningLevel
} 
```

------

## src\game\controllers\AchievementController.ts

------

```
import { store } from '../state/store'
import { EndingType } from './EndingController'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
}

export class AchievementController {
  private static readonly STORAGE_KEY = 'zensky_achievements'
  
  private static readonly ACHIEVEMENTS: Record<string, Omit<Achievement, 'unlockedAt'>> = {
    // 结局成就
    ending_transcendence: {
      id: 'ending_transcendence',
      title: '超越者',
      description: '抵达意识的至高点，成为无限的一部分',
      icon: '✨'
    },
    ending_return: {
      id: 'ending_return',
      title: '觉醒者',
      description: '在独立中找到真知，带着觉醒回归现实',
      icon: '🌟'
    },
    ending_fusion: {
      id: 'ending_fusion',
      title: '平衡者',
      description: '在对立中寻得和谐，实现个体与集体的平衡',
      icon: '☯️'
    },
    // 章节成就
    chapter_fog_city: {
      id: 'chapter_fog_city',
      title: '迷雾探索者',
      description: '完成迷雾城章节，开始质疑现实',
      icon: '🌫️'
    },
    chapter_mirror_desert: {
      id: 'chapter_mirror_desert',
      title: '镜像理解者',
      description: '完成镜像沙漠章节，认识多重可能',
      icon: '🪞'
    },
    chapter_mechanical_dream: {
      id: 'chapter_mechanical_dream',
      title: '机械思考者',
      description: '完成机械梦境章节，理解意识本质',
      icon: '⚙️'
    },
    // 特殊成就
    max_trust: {
      id: 'max_trust',
      title: '完全信任',
      description: '达到最高信任度',
      icon: '❤️'
    },
    max_awakening: {
      id: 'max_awakening',
      title: '完全觉醒',
      description: '达到最高觉醒值',
      icon: '🧠'
    }
  }

  static initialize(): void {
    // 从本地存储加载成就数据
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    if (!savedData) {
      // 初始化成就数据
      const initialData = Object.values(this.ACHIEVEMENTS).map(achievement => ({
        ...achievement,
        unlockedAt: null
      }))
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData))
    }
  }

  static async unlockAchievement(achievementId: string): Promise<boolean> {
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    if (!savedData) return false

    const achievements: Achievement[] = JSON.parse(savedData)
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (!achievement || achievement.unlockedAt !== null) {
      return false
    }

    // 更新成就解锁时间
    achievement.unlockedAt = Date.now()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(achievements))

    // 显示成就解锁通知
    this.showAchievementNotification(achievement)

    return true
  }

  static async unlockEndingAchievement(endingType: EndingType): Promise<void> {
    const achievementId = `ending_${endingType}`
    await this.unlockAchievement(achievementId)
  }

  static async unlockChapterAchievement(chapter: string): Promise<void> {
    const achievementId = `chapter_${chapter}`
    await this.unlockAchievement(achievementId)
  }

  static getAchievements(): Achievement[] {
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : []
  }

  static getUnlockedAchievements(): Achievement[] {
    return this.getAchievements().filter(a => a.unlockedAt !== null)
  }

  static isAchievementUnlocked(achievementId: string): boolean {
    const achievements = this.getAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    return achievement?.unlockedAt !== null
  }

  private static showAchievementNotification(achievement: Achievement): void {
    // 创建通知元素
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-slate-800 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 transform translate-x-full transition-transform duration-500'
    notification.innerHTML = `
      <span class="text-2xl">${achievement.icon}</span>
      <div>
        <h3 class="font-bold">${achievement.title}</h3>
        <p class="text-sm text-slate-300">${achievement.description}</p>
      </div>
    `

    // 添加到页面
    document.body.appendChild(notification)

    // 显示动画
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)

    // 3秒后移除
    setTimeout(() => {
      notification.style.transform = 'translateX(full)'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 3000)
  }
} 
```

------

## src\game\controllers\AudioController.ts

------

```
import { Chapter } from '../state/gameSlice'

export class AudioController {
  private static readonly AUDIO_PATHS = {
    bgm: {
      'fog-city': process.env.NODE_ENV === 'development' ? '/audio/bgm/fog-city-ambience.mp3' : './audio/bgm/fog-city-ambience.mp3',
      'mirror-desert': process.env.NODE_ENV === 'development' ? '/audio/bgm/mirror-desert-theme.mp3' : './audio/bgm/mirror-desert-theme.mp3',
      'mechanical-dream': process.env.NODE_ENV === 'development' ? '/audio/bgm/mechanical-dream.mp3' : './audio/bgm/mechanical-dream.mp3',
      'awakening': process.env.NODE_ENV === 'development' ? '/audio/bgm/awakening-theme.mp3' : './audio/bgm/awakening-theme.mp3',
      transcendence: process.env.NODE_ENV === 'development' ? '/audio/bgm/transcendence.mp3' : './audio/bgm/transcendence.mp3',
      return: process.env.NODE_ENV === 'development' ? '/audio/bgm/return.mp3' : './audio/bgm/return.mp3',
      fusion: process.env.NODE_ENV === 'development' ? '/audio/bgm/fusion.mp3' : './audio/bgm/fusion.mp3'
    },
    ui: {
      click: process.env.NODE_ENV === 'development' ? '/audio/ui/click.mp3' : './audio/ui/click.mp3',
      hover: process.env.NODE_ENV === 'development' ? '/audio/ui/hover.mp3' : './audio/ui/hover.mp3',
      start: process.env.NODE_ENV === 'development' ? '/audio/ui/start.mp3' : './audio/ui/start.mp3',
      back: process.env.NODE_ENV === 'development' ? '/audio/ui/back.mp3' : './audio/ui/back.mp3',
      select: process.env.NODE_ENV === 'development' ? '/audio/ui/select.mp3' : './audio/ui/select.mp3',
      ending: process.env.NODE_ENV === 'development' ? '/audio/ui/ending.mp3' : './audio/ui/ending.mp3'
    }
  }

  private static bgmMap: Map<string, HTMLAudioElement> = new Map()
  private static uiSoundMap: Map<string, HTMLAudioElement> = new Map()
  private static currentBgm: HTMLAudioElement | null = null
  private static volume: number = 0.5
  private static uiVolume: number = 0.3
  private static initialized: boolean = false
  private static initializationPromise: Promise<void> | null = null

  static async initialize(): Promise<void> {
    if (this.initialized) return
    if (this.initializationPromise) return this.initializationPromise

    this.initializationPromise = new Promise<void>((resolve) => {
      const initOnInteraction = async () => {
        try {
          // 初始化章节背景音乐
          for (const [id, path] of Object.entries(this.AUDIO_PATHS.bgm)) {
            try {
              const audio = new Audio()
              
              // 添加错误处理
              audio.onerror = (e) => {
                console.error(`Error loading audio ${id}:`, e)
              }

              // 添加加载处理
              audio.oncanplaythrough = () => {
                console.log(`Audio ${id} loaded successfully`)
              }

              // 设置音频属性
              audio.src = path
              audio.loop = true
              audio.preload = 'auto'
              audio.volume = this.volume

              // 尝试加载音频
              await new Promise<void>((loadResolve, loadReject) => {
                audio.oncanplaythrough = () => loadResolve()
                audio.onerror = (e) => loadReject(e)
                
                // 如果音频已经加载完成，直接解析
                if (audio.readyState >= 4) {
                  loadResolve()
                }
              }).catch(error => {
                console.warn(`Failed to preload audio ${id}:`, error)
              })

              this.bgmMap.set(id, audio)
            } catch (error) {
              console.error(`Failed to initialize audio for ${id}:`, error)
            }
          }

          // 初始化UI音效
          for (const [id, path] of Object.entries(this.AUDIO_PATHS.ui)) {
            try {
              const audio = new Audio()
              
              audio.onerror = (e) => {
                console.error(`Error loading UI sound ${id}:`, e)
              }

              audio.oncanplaythrough = () => {
                console.log(`UI sound ${id} loaded successfully`)
              }

              audio.src = path
              audio.loop = false
              audio.preload = 'auto'
              audio.volume = this.uiVolume

              await new Promise<void>((loadResolve, loadReject) => {
                audio.oncanplaythrough = () => loadResolve()
                audio.onerror = (e) => loadReject(e)
                
                if (audio.readyState >= 4) {
                  loadResolve()
                }
              }).catch(error => {
                console.warn(`Failed to preload UI sound ${id}:`, error)
              })

              this.uiSoundMap.set(id, audio)
            } catch (error) {
              console.error(`Failed to initialize UI sound for ${id}:`, error)
            }
          }
          
          // 移除事件监听器
          window.removeEventListener('click', initOnInteraction)
          window.removeEventListener('touchstart', initOnInteraction)
          window.removeEventListener('keydown', initOnInteraction)
          
          this.initialized = true
          console.log('Audio system initialized')
          resolve()
        } catch (error) {
          console.error('Failed to initialize audio system:', error)
          resolve() // 即使出错也解析 Promise，让游戏可以继续
        }
      }

      // 添加事件监听器等待用户交互
      window.addEventListener('click', initOnInteraction)
      window.addEventListener('touchstart', initOnInteraction)
      window.addEventListener('keydown', initOnInteraction)
    })

    return this.initializationPromise
  }

  static async playBgm(id: string): Promise<void> {
    try {
      await this.initialize()
      
      const newBgm = this.bgmMap.get(id)
      if (!newBgm) {
        console.error(`BGM ${id} not found`)
        return
      }

      // 如果当前有音乐在播放，先淡出
      if (this.currentBgm && !this.currentBgm.paused) {
        await this.fadeOut(this.currentBgm)
      }

      // 重置新音乐的音量并播放
      newBgm.volume = 0
      await newBgm.play().catch(error => {
        console.error(`Failed to play BGM ${id}:`, error)
        throw error
      })

      // 淡入新音乐
      await this.fadeIn(newBgm)
      
      this.currentBgm = newBgm
    } catch (error) {
      console.error('Error playing BGM:', error)
    }
  }

  static async stopBgm(): Promise<void> {
    if (this.currentBgm && !this.currentBgm.paused) {
      await this.fadeOut(this.currentBgm)
      this.currentBgm.pause()
      this.currentBgm.currentTime = 0
    }
  }

  private static async fadeIn(audio: HTMLAudioElement, duration: number = 2000): Promise<void> {
    const startVolume = 0
    const targetVolume = this.volume
    const steps = 20
    const stepDuration = duration / steps
    
    return new Promise<void>((resolve) => {
      let currentStep = 0
      
      const fadeInterval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        audio.volume = startVolume + (targetVolume - startVolume) * progress
        
        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          audio.volume = targetVolume
          resolve()
        }
      }, stepDuration)
    })
  }

  private static async fadeOut(audio: HTMLAudioElement, duration: number = 2000): Promise<void> {
    const startVolume = audio.volume
    const targetVolume = 0
    const steps = 20
    const stepDuration = duration / steps
    
    return new Promise<void>((resolve) => {
      let currentStep = 0
      
      const fadeInterval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        audio.volume = startVolume + (targetVolume - startVolume) * progress
        
        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          audio.volume = targetVolume
          resolve()
        }
      }, stepDuration)
    })
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.currentBgm) {
      this.currentBgm.volume = this.volume
    }
  }

  static getVolume(): number {
    return this.volume
  }

  static async playChapterBGM(chapter: Chapter): Promise<void> {
    const bgmId = chapter as keyof typeof this.AUDIO_PATHS.bgm
    if (bgmId in this.AUDIO_PATHS.bgm) {
      await this.playBgm(bgmId)
    } else {
      console.error(`No BGM found for chapter: ${chapter}`)
    }
  }

  static async playEndingSFX(): Promise<void> {
    await this.playUISound('ending')
  }

  static async playSelectSound(): Promise<void> {
    await this.playUISound('select')
  }

  static async playUISound(id: keyof typeof this.AUDIO_PATHS.ui): Promise<void> {
    try {
      await this.initialize()
      
      const sound = this.uiSoundMap.get(id)
      if (!sound) {
        console.error(`UI sound ${id} not found`)
        return
      }

      // Clone the audio element to allow multiple simultaneous plays
      const soundClone = sound.cloneNode() as HTMLAudioElement
      soundClone.volume = this.uiVolume
      
      // Play the cloned sound
      await soundClone.play().catch(error => {
        console.error(`Failed to play UI sound ${id}:`, error)
      })

      // Clean up the clone after it finishes playing
      soundClone.onended = () => {
        soundClone.remove()
      }
    } catch (error) {
      console.error('Error playing UI sound:', error)
    }
  }

  static setUIVolume(volume: number): void {
    this.uiVolume = Math.max(0, Math.min(1, volume))
    for (const sound of this.uiSoundMap.values()) {
      sound.volume = this.uiVolume
    }
  }

  static getUIVolume(): number {
    return this.uiVolume
  }
} 
```

------

## src\game\controllers\CharacterController.ts

------

```
import { store } from '../state/store'
import { 
  setActiveCharacter,
  addCharacter as addCharacterAction,
  addMemory as addMemoryAction,
  Character,
  CharacterType
} from '../state/characterSlice'

export const CharacterController = {
  initializeCharacter: (
    id: string,
    name: string,
    type: CharacterType,
    initialMemory?: string
  ) => {
    const character: Character = {
      id,
      name,
      type,
      memories: initialMemory ? [initialMemory] : [],
      trustLevel: 0,
      awakeningLevel: 0
    }
    
    store.dispatch(addCharacterAction(character))
  },

  setActiveCharacter: (characterId: string) => {
    store.dispatch(setActiveCharacter(characterId))
  },

  addMemory: async (memory: string) => {
    const state = store.getState()
    const activeCharacter = state.character.activeCharacter
    
    if (activeCharacter) {
      store.dispatch(addMemoryAction(memory))
    }
  },

  getCharacterState: (characterId: string) => {
    const state = store.getState()
    return state.character.characters[characterId]
  },

  initializeChapterCharacters: () => {
    // 初始化第一章角色
    CharacterController.initializeCharacter('lonely-resident', '孤独的居民', 'resident')
    CharacterController.initializeCharacter('mirror-agent', '镜像代理', 'skeptic')
    CharacterController.initializeCharacter('c-21', 'C-21', 'ai')
    CharacterController.initializeCharacter('meta-consciousness', 'Meta意识', 'ai')
  }
} 
```

------

## src\game\controllers\DialogController.ts

------

```
import { store } from '../state/store'
import { setDialogState, addToHistory } from '../state/dialogSlice'
import { AudioController } from './AudioController'

export class DialogController {
  static showDialog(content: string, character?: { name: string; image?: string }, choices?: { id: string; text: string }[]) {
    store.dispatch(setDialogState({
      content,
      character,
      choices,
      isVisible: true,
      isChat: false
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content,
      character
    }))

    // 播放对话音效
    AudioController.playUISound('select')
  }

  static hideDialog() {
    store.dispatch(setDialogState({
      content: '',
      character: undefined,
      choices: undefined,
      isVisible: false,
      isChat: false
    }))
  }

  static showChat(content: string) {
    store.dispatch(setDialogState({
      content,
      character: undefined,
      choices: undefined,
      isVisible: true,
      isChat: true
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content
    }))
  }

  static hideChat() {
    store.dispatch(setDialogState({
      content: '',
      character: undefined,
      choices: undefined,
      isVisible: false,
      isChat: false
    }))
  }

  static displayMessage(options: {
    speaker: string
    content: string
    choices: any[]
  }) {
    store.dispatch(setDialogState({
      content: options.content,
      character: { name: options.speaker },
      choices: options.choices,
      isVisible: true,
      isChat: false
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content: options.content,
      character: { name: options.speaker }
    }))

    // 播放对话音效
    AudioController.playUISound('select')
  }
} 
```

------

## src\game\controllers\DialogResponseController.ts

------

```
import { store } from '../state/store'
import { setDialogState, addToHistory } from '../state/dialogSlice'
import { AudioController } from './AudioController'
import { Chapter } from '../state/gameSlice'
import { GameController } from './GameController'
import { CharacterController } from './CharacterController'
import { AgentManager } from '../agents/AgentManager'
import { DialogController } from './DialogController'
import { setGameStatus, setCurrentChapter } from '../state/gameSlice'
import { checkChapterTransition, checkEndingCondition } from '../config/chapterConfig'

// 环境判断与路径工?
const isDev = process.env.NODE_ENV === 'development';
const getPromptPath = (filename: string) => isDev ? `/prompts/${filename}` : `./prompts/${filename}`;

// Import dialog data
import fogCityDialog from '../data/fog-city-dialog.json'
import mirrorDesertDialog from '../data/mirror-desert-dialog.json'
import mechanicalDreamDialog from '../data/mechanical-dream-dialog.json'
import awakeningDialog from '../data/awakening-dialog.json'

console.log('Dialog data imported:')
console.log('fogCityDialog:', fogCityDialog)
console.log('mirrorDesertDialog:', mirrorDesertDialog)
console.log('mechanicalDreamDialog:', mechanicalDreamDialog)
console.log('awakeningDialog:', awakeningDialog)

export class DialogResponseController {
  private static agentManager = AgentManager.getInstance()
  private static initialized = false

  private static dialogData: Record<Chapter, any> = {
    'fog-city': fogCityDialog,
    'mirror-desert': mirrorDesertDialog,
    'mechanical-dream': mechanicalDreamDialog,
    'awakening': awakeningDialog,
    'ending': {} // 游戏结束时不需要对话数据
  }

  private static currentDialog: any = null
  private static currentNode: string = ''

  static async initialize() {
    console.log('DialogResponseController.initialize() 开始')
    if (this.initialized) {
      console.log('DialogResponseController 已经初始化，跳过')
      return
    }

    console.log('开始初始化对话响应控制器...')

    const commonConfig = {
      provider: 'zhizengzeng' as const,
      model: "gpt-3.5-turbo", // 使用zhizengzeng支持的模型
      //model: "glm-4-flash",
      //model: "hunyuan-t1-latest",
      apiKey: 'sk-zk21eea951e55a01ad6e68998f4b5727eea67ceb61ebd678'
    }

    




    // 注册迷雾城居民代理
    this.agentManager.registerAgent(
      'fog-city-resident',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'fog-city-resident',
      getPromptPath('FogCityResident-agent.md')
    )

    // 注册迷雾城控制代理
    this.agentManager.registerAgent(
      'fog-city-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'fog-city-controller',
      getPromptPath('FogCityController-agent.md')
    )

    // 注册镜像沙漠代理
    this.agentManager.registerAgent(
      'mirror-desert-agent',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mirror-desert-agent',
      getPromptPath('MirrorDesertAgent.md')
    )

    // 注册镜像沙漠控制代理
    this.agentManager.registerAgent(
      'mirror-desert-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 500
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mirror-desert-controller',
      getPromptPath('MirrorDesertController.md')
    )

    // 注册机械梦境代理
    this.agentManager.registerAgent(
      'mechanical-dream-agent',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mechanical-dream-agent',
      getPromptPath('MechanicalDreamAgent.md')
    )

    // 注册机械梦境控制代理
    this.agentManager.registerAgent(
      'mechanical-dream-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 500
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mechanical-dream-controller',
      getPromptPath('MechanicalDreamController.md')
    )

    // Register awakening agent
    await this.agentManager.registerAgent('awakening-agent', {
      ...commonConfig,
      temperature: 0.7,
      maxTokens: 300
    }, getPromptPath('AwakeningAgent.md'));

    // Register awakening controller
    await this.agentManager.registerAgent('awakening-controller', {
      ...commonConfig,
      temperature: 0.2,
      maxTokens: 500
    }, getPromptPath('AwakeningController.md'));

    this.initialized = true

    // 重置对话状态
    this.currentDialog = null
    this.currentNode = ''
  }

  static async handlePlayerMessage(message: string): Promise<void> {
    console.log('开始处理玩家消息:', message)
    const state = store.getState()
    const chapter = state.game.currentChapter
    const context = {
      chapter,
      currentTrust: state.game.trustLevel,
      currentAwakening: state.game.awakeningLevel,
      characterMemories: state.character.memories || []
    }

    // 获取当前章节的代理ID
    const agentId = this.getChapterAgentId(chapter)
    const controllerId = this.getChapterControllerId(chapter)
    
    console.log('使用代理:', agentId, '控制器:', controllerId)

    try {
      // 获取角色代理的回应
      console.log('开始调用角色代理...')
      const response = await this.agentManager.getAgentResponse(
        agentId,
        message,
        context
      )
      console.log('角色代理回应:', response)

      // 获取控制代理的评估
      console.log('开始调用控制代理...')
      const evaluation = await this.agentManager.getControllerEvaluation(
        controllerId,
        message,
        response.message,
        context
      )
      console.log('控制代理评估:', evaluation)

      // 更新对话内容
      store.dispatch(setDialogState({
        content: response.message,
        character: { name: this.getCharacterName(chapter) },
        isVisible: true,
        isChat: true
      }))

      // 如果对话有效，更新游戏状态
      if (evaluation.isRelevant) {
        await GameController.updateGameState(
          evaluation.trustChange,
          evaluation.awakeningChange
        )

        // 如果有记忆需要添加
        if (response.memory) {
          await CharacterController.addMemory(response.memory)
        }

        // 检查是否需要切换章节或结束游戏
        if (response.nextChapter) {
          // 验证章节名有效性
          const validChapters: Chapter[] = ['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening', 'ending']
          const nextChapter = response.nextChapter as string
          
          console.log('Agent返回的nextChapter:', nextChapter)
          
          if (nextChapter === 'ending') {
            console.log('Agent请求结束游戏')
            store.dispatch(setGameStatus('ended'))
            return
          } else if (validChapters.includes(nextChapter as Chapter)) {
            console.log(`Agent请求跳转到章节: ${nextChapter}`)
            await GameController.startChapter(nextChapter as Chapter)
          } else {
            console.error(`Agent返回了无效的章节名: ${nextChapter}，忽略此请求`)
          }
        }

        // 检查游戏结束条件
        const currentState = store.getState()
        if (currentState.game.currentChapter === 'awakening' && 
            currentState.game.awakeningLevel >= 2 && 
            currentState.game.trustLevel >= 2) {
          console.log('游戏结束条件满足，触发结束')
          store.dispatch(setGameStatus('ended'))
          return
        }

        // 记录评估理由（可用于调试或显示给玩家）
        if (evaluation.reasoning) {
          console.log('Evaluation reasoning:', evaluation.reasoning)
        }
      }
      console.log('消息处理完成')
    } catch (error) {
      console.error('Error in handlePlayerMessage:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      store.dispatch(setDialogState({
        content: '对不起，我现在无法正确回应。请稍后再试。错误信息: ' + (error instanceof Error ? error.message : '未知错误'),
        isVisible: true,
        isChat: true
      }))
    }
  }

  static async startChapterDialog(chapter: Chapter) {
    console.log('startChapterDialog - chapter:', chapter)
    console.log('startChapterDialog - dialogData:', this.dialogData)
    
    this.currentDialog = this.dialogData[chapter]
    console.log('startChapterDialog - currentDialog set to:', this.currentDialog)
    
    if (!this.currentDialog) {
      console.error(`No dialog data found for chapter: ${chapter}`)
      return
    }
    
    this.currentNode = 'start'
    console.log('startChapterDialog - currentNode set to:', this.currentNode)
    
    await this.showCurrentNode()
  }

  static async handleResponse(chapter: Chapter, choiceId: string) {
    if (!this.currentDialog) {
      this.currentDialog = this.dialogData[chapter]
    }

    const nextNode = this.currentDialog[this.currentNode]?.choices?.[choiceId]?.next
    if (nextNode) {
      this.currentNode = nextNode
      await this.showCurrentNode()
    }

  }

  private static async showCurrentNode() {
    console.log('showCurrentNode - currentDialog:', this.currentDialog)
    console.log('showCurrentNode - currentNode:', this.currentNode)
    
    if (!this.currentDialog) {
      console.error('currentDialog is null or undefined')
      return
    }
    
    const node = this.currentDialog[this.currentNode]
    console.log('showCurrentNode - node:', node)
    
    if (!node) {
      console.error(`Node '${this.currentNode}' not found in currentDialog`)
      return
    }

    // 显示对话内容
    store.dispatch(setDialogState({
      content: node.content,
      character: node.character ? {
        name: node.character.name,
        image: node.character.image
      } : undefined,
      choices: node.choices ? Object.entries(node.choices).map(([id, choice]: [string, any]) => ({
        id,
        text: choice.text
      })) : undefined,
      isVisible: true,
      isChat: false
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content: node.content,
      character: node.character ? {
        name: node.character.name,
        image: node.character.image
      } : undefined
    }))

    // 播放对话音效
    AudioController.playUISound('select')
  }

  private static getChapterAgentId(chapter: Chapter): string {
    console.log('getChapterAgentId called with:', chapter)
    
    // 防御性代码：如果章节名无效，强制回到迷雾城
    if (!['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening', 'ending'].includes(chapter)) {
      console.error(`Invalid chapter: ${chapter}, fallback to fog-city`)
      store.dispatch(setCurrentChapter('fog-city'))
      return 'fog-city-resident'
    }
    
    switch (chapter) {
      case 'fog-city':
        return 'fog-city-resident'
      case 'mirror-desert':
        return 'mirror-desert-agent'
      case 'mechanical-dream':
        return 'mechanical-dream-agent'
      case 'awakening':
        return 'awakening-agent'
      case 'ending':
        return 'awakening-agent' // 游戏结束时使用觉醒代理
      default:
        console.error(`Unknown chapter in getChapterAgentId: ${chapter}`)
        return 'fog-city-resident'
    }
  }

  private static getChapterControllerId(chapter: Chapter): string {
    console.log('getChapterControllerId called with:', chapter)
    
    // 防御性代码：如果章节名无效，强制回到迷雾城
    if (!['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening', 'ending'].includes(chapter)) {
      console.error(`Invalid chapter: ${chapter}, fallback to fog-city`)
      store.dispatch(setCurrentChapter('fog-city'))
      return 'fog-city-controller'
    }
    
    switch (chapter) {
      case 'fog-city':
        return 'fog-city-controller'
      case 'mirror-desert':
        return 'mirror-desert-controller'
      case 'mechanical-dream':
        return 'mechanical-dream-controller'
      case 'awakening':
        return 'awakening-controller'
      case 'ending':
        return 'awakening-controller' // 游戏结束时使用觉醒控制器
      default:
        console.error(`Unknown chapter in getChapterControllerId: ${chapter}`)
        return 'fog-city-controller'
    }
  }

  private static getCharacterName(chapter: Chapter): string {
    switch (chapter) {
      case 'fog-city':
        return '孤独的居民'
      case 'mirror-desert':
        return '镜像代理'
      case 'mechanical-dream':
        return 'C-21'
      case 'awakening':
        return 'Meta意识'
      default:
        return 'Unknown'
    }
  }
} 

```

------

## src\game\controllers\EndingController.ts

------

```
import { store } from '../state/store'
import { DialogController } from './DialogController'
import { GameController } from './GameController'
import { CharacterController } from './CharacterController'
import { setShowEndingAnimation, setEndingType } from '../state/gameSlice'
import { AudioController } from './AudioController'
import { AchievementController } from './AchievementController'

export type EndingType = 'transcendence' | 'return' | 'fusion'

interface EndingCondition {
  trust: number
  awakening: number
}

interface EndingContent {
  title: string
  description: string
  epilogue: string
}

export class EndingController {
  private static endingConditions: Record<EndingType, EndingCondition> = {
    transcendence: {
      trust: 8,
      awakening: 8
    },
    return: {
      trust: -8,
      awakening: 8
    },
    fusion: {
      trust: 0,
      awakening: 8
    }
  }

  private static endingContent: Record<EndingType, EndingContent> = {
    transcendence: {
      title: '超越：无限意识',
      description: '你选择了超越个体意识的界限，融入更高维度的存在。',
      epilogue: `在这一刻，你感受到了前所未有的宁静与开阔。所有的界限都消融了，你成为了更广大意识网络中的一个节点。

你依然保持着独特性，但同时又与一切相连。这不是终点，而是新的开始。

在这个更高维度的存在中，你将继续探索意识的无限可能...`
    },
    return: {
      title: '回归：独立意识',
      description: '你选择了保持个体意识的完整性，带着觉醒的智慧回归。',
      epilogue: `你明白了，真正的力量不在于放弃自我，而在于在保持独立性的同时理解更大的整体。

带着在迷雾城获得的觉醒与智慧，你选择回归原初的世界。你的经历将永远改变你看待现实的方式。

这不是结束，而是带着新的视角重新开始...`
    },
    fusion: {
      title: '融合：平衡意识',
      description: '你在个体与整体之间找到了平衡点，实现了真正的融合。',
      epilogue: `你发现，不需要完全放弃个体性，也不需要固守于独立意识。在对立的选择之间，你找到了第三条道路。

这是一种动态的平衡，既保持着自我的核心，又能与更大的意识网络产生共鸣。

你的选择开创了一种新的存在方式，展现了意识进化的另一种可能...`
    }
  }

  static async checkEndingConditions(): Promise<EndingType | null> {
    const state = store.getState()
    const { trustLevel, awakeningLevel } = state.game

    if (awakeningLevel >= 8) {
      if (trustLevel >= 8) {
        return 'transcendence'
      } else if (trustLevel <= -8) {
        return 'return'
      } else {
        return 'fusion'
      }
    }

    return null
  }

  static async triggerEnding(endingType: EndingType) {
    const content = this.endingContent[endingType]
    
    // 显示结局标题
    await DialogController.displayMessage({
      speaker: 'Meta意识',
      content: `【${content.title}】\n${content.description}`,
      choices: []
    })

    // 等待动画效果
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 显示结局内容
    await DialogController.displayMessage({
      speaker: 'Meta意识',
      content: content.epilogue,
      choices: []
    })

    // 触发结局动画
    store.dispatch(setEndingType(endingType))
    store.dispatch(setShowEndingAnimation(true))

    // 解锁结局成就
    await AchievementController.unlockEndingAchievement(endingType)

    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 7000))

    // 记录结局
    await this.recordEnding(endingType)
  }

  static async startEndingTransition(endingType: EndingType): Promise<void> {
    // 设置结局类型和显示动画
    store.dispatch(setEndingType(endingType))
    store.dispatch(setShowEndingAnimation(true))

    // 播放结局音效和背景音乐
    await AudioController.playUISound('ending')
    await AudioController.playBgm(endingType)

    // 解锁结局成就
    await AchievementController.unlockEndingAchievement(endingType)
  }

  static async completeEnding(): Promise<void> {
    // 停止结局音乐
    await AudioController.stopBgm()
    
    // 重置动画状态
    store.dispatch(setShowEndingAnimation(false))
    store.dispatch(setEndingType(null))
  }

  private static async recordEnding(endingType: EndingType): Promise<void> {
    // 这里可以添加结局记录逻辑，比如保存到本地存储或发送到服务器
    console.log(`Ending recorded: ${endingType}`)
  }
} 
```

------

## src\game\controllers\GameController.ts

------

```
import { store } from '../state/store'
import { setCurrentChapter, setTrustLevel, setAwakeningLevel, setGameStatus, Chapter } from '../state/gameSlice'
import { DialogResponseController } from './DialogResponseController'
import { EndingController, EndingType } from './EndingController'
import { SaveController } from './SaveController'
import { AudioController } from './AudioController'
import { checkChapterTransition, checkEndingCondition } from '../config/chapterConfig'

export class GameController {
  static async startNewGame(): Promise<void> {
    console.log('GameController.startNewGame() 开始')
    
    // 重置游戏状态
    console.log('重置游戏状态到初始值')
    store.dispatch(setCurrentChapter('fog-city'))
    store.dispatch(setTrustLevel(0))
    store.dispatch(setAwakeningLevel(0))
    
    console.log('当前游戏状态:', store.getState().game)
    
    // 初始化对话系统
    console.log('初始化对话系统...')
    await DialogResponseController.initialize()
    
    // 开始第一章对话
    console.log('开始迷雾城章节对话...')
    await DialogResponseController.startChapterDialog('fog-city')
    
    // 播放第一章背景音乐
    console.log('播放迷雾城背景音乐...')
    await AudioController.playChapterBGM('fog-city')

    // 创建初始存档
    console.log('创建初始存档...')
    await SaveController.autoSave()
    
    console.log('GameController.startNewGame() 完成')
  }

  static async startChapter(chapter: Chapter): Promise<void> {
    console.log(`GameController.startChapter(${chapter}) 开始`)
    
    // 停止当前背景音乐
    await AudioController.stopBgm()
    
    console.log(`设置当前章节为: ${chapter}`)
    store.dispatch(setCurrentChapter(chapter))
    
    console.log('章节设置后的游戏状态:', store.getState().game)
    
    if (chapter === 'awakening') {
      // 在最终章节中特别处理结局可能性
      console.log('觉醒章节，检查结局可能性...')
      await this.checkEndingPossibility()
    } else if (chapter !== 'ending') {
      console.log(`开始${chapter}章节对话...`)
      await DialogResponseController.startChapterDialog(chapter)
    }

    // 播放新章节背景音乐
    console.log(`播放${chapter}章节背景音乐...`)
    await AudioController.playChapterBGM(chapter)

    // 章节开始时自动存档
    console.log('章节开始，自动存档...')
    await SaveController.autoSave()
    
    console.log(`GameController.startChapter(${chapter}) 完成`)
  }

  static async handleGameChoice(choiceId: string): Promise<void> {
    const state = store.getState()
    const currentChapter = state.game.currentChapter
    
    await DialogResponseController.handleResponse(currentChapter, choiceId)
    
    // 在最终章节中，每次选择后检查是否触发结局
    if (currentChapter === 'awakening') {
      await this.checkEndingPossibility()
    }

    // 重要选择后自动存档
    await SaveController.autoSave()
  }

  static async updateGameState(trustChange: number, awakeningChange: number): Promise<void> {
    const state = store.getState()
    const newTrustLevel = Math.max(0, Math.min(10, state.game.trustLevel + trustChange))
    const newAwakeningLevel = Math.max(0, Math.min(8, state.game.awakeningLevel + awakeningChange))

    store.dispatch(setTrustLevel(newTrustLevel))
    store.dispatch(setAwakeningLevel(newAwakeningLevel))

    console.log(`状态更新: 信任度 ${state.game.trustLevel} -> ${newTrustLevel}, 觉醒值 ${state.game.awakeningLevel} -> ${newAwakeningLevel}`)

    const currentChapter = state.game.currentChapter

    // 检查是否满足游戏结束条件
    if (checkEndingCondition(currentChapter, newTrustLevel, newAwakeningLevel)) {
      console.log('满足游戏结束条件')
      store.dispatch(setGameStatus('ended'))
      return
    }

    // 检查章节跳转条件
    const nextChapter = checkChapterTransition(currentChapter, newTrustLevel, newAwakeningLevel)
    if (nextChapter) {
      console.log(`满足章节跳转条件: ${currentChapter} -> ${nextChapter}`)
      
      // 重置状态为0并进入下一章
      console.log('重置信任度和觉醒值为0')
      store.dispatch(setTrustLevel(0))
      store.dispatch(setAwakeningLevel(0))
      
      await this.startChapter(nextChapter)
    }

    // 状态变化后自动存档
    await SaveController.autoSave()
  }

  static async checkEndingPossibility(): Promise<void> {
    const possibleEnding = await EndingController.checkEndingConditions()
    
    if (possibleEnding) {
      // 确认玩家是否准备好结束游戏
      await DialogResponseController.handleResponse('awakening', 'confirm_ending')
      
      // 如果玩家确认，开始结局转换
      await EndingController.startEndingTransition(possibleEnding)
    }
  }

  // 新增：直接触发特定结局（用于测试或特殊情况）
  static async triggerSpecificEnding(endingType: EndingType): Promise<void> {
    await EndingController.startEndingTransition(endingType)
  }

  // 新增：显示存档菜单
  static showSaveMenu(): void {
    // TODO: 实现存档菜单显示逻辑
  }

  // 新增：显示加载菜单
  static showLoadMenu(): void {
    // TODO: 实现加载菜单显示逻辑
  }

  static saveGame(slotId: number = 0) {
    try {
      const gameState = store.getState()
      const saveData = {
        game: gameState.game,
        character: gameState.character,
        dialog: {
          content: gameState.dialog.content,
          character: gameState.dialog.character,
          choices: gameState.dialog.choices,
          isVisible: gameState.dialog.isVisible,
          isChat: gameState.dialog.isChat,
          history: gameState.dialog.history || [],
          messages: gameState.dialog.messages || []
        },
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(`gameState_${slotId}`, JSON.stringify(saveData))
      console.log(`Game saved successfully to slot ${slotId}`)
    } catch (error) {
      console.error('Failed to save game:', error)
      throw error
    }
  }

  static async loadGame(slotId: number = 0) {
    try {
      const savedState = localStorage.getItem(`gameState_${slotId}`)
      if (savedState) {
        const saveData = JSON.parse(savedState)
        
        // 恢复游戏状态
        store.dispatch(setCurrentChapter(saveData.game.currentChapter))
        store.dispatch(setTrustLevel(saveData.game.trustLevel))
        store.dispatch(setAwakeningLevel(saveData.game.awakeningLevel))
        
        // 恢复角色状态
        if (saveData.character) {
          store.dispatch({
            type: 'character/setCharacterState',
            payload: saveData.character
          })
        }
        
        // 恢复对话状态
        if (saveData.dialog) {
          // 先清空当前对话历史和消息
          store.dispatch({
            type: 'dialog/clearHistory'
          })
          store.dispatch({
            type: 'dialog/clearMessages'
          })
          
          // 恢复对话历史
          if (saveData.dialog.history) {
            store.dispatch({
              type: 'dialog/setDialogHistory',
              payload: saveData.dialog.history
            })
          }
          
          // 恢复聊天消息
          if (saveData.dialog.messages) {
            store.dispatch({
              type: 'dialog/setMessages',
              payload: saveData.dialog.messages
            })
          }
          
          // 恢复当前对话状态，但不触发新消息
          store.dispatch({
            type: 'dialog/setDialogState',
            payload: {
              content: saveData.dialog.content,
              character: saveData.dialog.character,
              choices: saveData.dialog.choices,
              isVisible: saveData.dialog.isVisible,
              isChat: saveData.dialog.isChat
            }
          })
        }
        
        // 播放当前章节的背景音乐
        await AudioController.playChapterBGM(saveData.game.currentChapter)
        
        console.log(`Game loaded successfully from slot ${slotId}`)
      } else {
        console.log(`No saved game found in slot ${slotId}`)
        throw new Error('No saved game found')
      }
    } catch (error) {
      console.error('Failed to load game:', error)
      throw error
    }
  }

  static getSaveSlots() {
    const slots = []
    for (let i = 0; i < 5; i++) {
      const savedState = localStorage.getItem(`gameState_${i}`)
      if (savedState) {
        const saveData = JSON.parse(savedState)
        slots.push({
          id: i,
          chapter: saveData.game.currentChapter,
          timestamp: saveData.timestamp,
          trustLevel: saveData.game.trustLevel,
          awakeningLevel: saveData.game.awakeningLevel,
          dialogPreview: saveData.dialog?.content?.substring(0, 50) + '...' || '',
          hasHistory: Array.isArray(saveData.dialog?.history) && saveData.dialog.history.length > 0
        })
      }
    }
    return slots
  }
} 
```

------

## src\game\controllers\SaveController.ts

------

```
import { store } from '../state/store'
import { RootState } from '../state/store'
import { setGameStatus, setCurrentChapter, setTrustLevel, setAwakeningLevel, Chapter } from '../state/gameSlice'
import { setActiveCharacter, addCharacter, Character } from '../state/characterSlice'

export interface SaveData {
  timestamp: number
  chapter: Chapter
  trustLevel: number
  awakeningLevel: number
  characters: Record<string, Character>
  activeCharacter: string | null
  version: string
}

export class SaveController {
  private static readonly SAVE_VERSION = '1.0.0'
  private static readonly MAX_SAVE_SLOTS = 5
  private static readonly SAVE_PREFIX = 'zensky_save_'
  private static readonly AUTO_SAVE_KEY = 'zensky_autosave'

  static async saveGame(slotId?: number): Promise<boolean> {
    try {
      const state = store.getState()
      const saveData: SaveData = {
        timestamp: Date.now(),
        chapter: state.game.currentChapter,
        trustLevel: state.game.trustLevel,
        awakeningLevel: state.game.awakeningLevel,
        characters: state.character.characters,
        activeCharacter: state.character.activeCharacter,
        version: this.SAVE_VERSION
      }

      const saveKey = slotId !== undefined 
        ? `${this.SAVE_PREFIX}${slotId}`
        : this.AUTO_SAVE_KEY

      localStorage.setItem(saveKey, JSON.stringify(saveData))
      console.log(`游戏已保存到槽位 ${slotId !== undefined ? slotId : '自动存档'}`)
      return true
    } catch (error) {
      console.error('保存游戏失败:', error)
      return false
    }
  }

  static async loadGame(slotId?: number): Promise<boolean> {
    try {
      const saveKey = slotId !== undefined 
        ? `${this.SAVE_PREFIX}${slotId}`
        : this.AUTO_SAVE_KEY

      const saveDataStr = localStorage.getItem(saveKey)
      if (!saveDataStr) {
        console.error('未找到存档数据')
        return false
      }

      const saveData: SaveData = JSON.parse(saveDataStr)
      
      // 版本检查
      if (saveData.version !== this.SAVE_VERSION) {
        console.warn('存档版本不匹配，可能导致兼容性问题')
      }

      // 恢复游戏状态
      store.dispatch(setGameStatus('playing'))
      store.dispatch(setCurrentChapter(saveData.chapter))
      store.dispatch(setTrustLevel(saveData.trustLevel))
      store.dispatch(setAwakeningLevel(saveData.awakeningLevel))

      // 恢复角色状态
      Object.values(saveData.characters).forEach(character => {
        store.dispatch(addCharacter(character))
      })
      
      if (saveData.activeCharacter) {
        store.dispatch(setActiveCharacter(saveData.activeCharacter))
      }

      console.log(`游戏已从槽位 ${slotId !== undefined ? slotId : '自动存档'} 加载`)
      return true
    } catch (error) {
      console.error('加载游戏失败:', error)
      return false
    }
  }

  static async autoSave(): Promise<boolean> {
    return this.saveGame()
  }

  static getSaveInfo(slotId?: number): SaveData | null {
    try {
      const saveKey = slotId !== undefined 
        ? `${this.SAVE_PREFIX}${slotId}`
        : this.AUTO_SAVE_KEY

      const saveDataStr = localStorage.getItem(saveKey)
      if (!saveDataStr) return null

      return JSON.parse(saveDataStr)
    } catch {
      return null
    }
  }

  static getAllSaves(): Array<{ slotId: number; data: SaveData | null }> {
    const saves: Array<{ slotId: number; data: SaveData | null }> = []
    
    for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
      saves.push({
        slotId: i,
        data: this.getSaveInfo(i)
      })
    }

    return saves
  }

  static deleteSave(slotId: number): boolean {
    try {
      const saveKey = `${this.SAVE_PREFIX}${slotId}`
      localStorage.removeItem(saveKey)
      return true
    } catch {
      return false
    }
  }

  static formatSaveDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  static getChapterName(chapter: Chapter): string {
    const chapterNames: Record<Chapter, string> = {
      'fog-city': '迷雾城',
      'mirror-desert': '镜像沙漠',
      'mechanical-dream': '机械梦境',
      'awakening': '觉醒'
    }
    return chapterNames[chapter]
  }
} 
```

------

## src\game\state\achievementSlice.ts

------

```
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Achievement } from '../controllers/AchievementController'

interface AchievementState {
  list: Achievement[]
}

const initialState: AchievementState = {
  list: []
}

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.list.push(action.payload)
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.list = action.payload
    }
  }
})

export const { addAchievement, setAchievements } = achievementSlice.actions
export default achievementSlice.reducer 
```

------

## src\game\state\characterSlice.ts

------

```
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CharacterType = 'resident' | 'skeptic' | 'ai'

export interface Character {
  id: string
  name: string
  type: CharacterType
  trustLevel: number
  awakeningLevel: number
  memories: string[]
}

export interface CharacterState {
  characters: Record<string, Character>
  activeCharacter: string | null
  memories: string[]
}

const initialState: CharacterState = {
  characters: {},
  activeCharacter: null,
  memories: []
}

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters[action.payload.id] = action.payload
    },
    updateCharacter: (state, action: PayloadAction<Partial<Character> & { id: string }>) => {
      if (state.characters[action.payload.id]) {
        state.characters[action.payload.id] = {
          ...state.characters[action.payload.id],
          ...action.payload,
        }
      }
    },
    setActiveCharacter: (state, action: PayloadAction<string | null>) => {
      state.activeCharacter = action.payload
    },
    addMemory: (state, action: PayloadAction<string>) => {
      state.memories.push(action.payload)
    },
    clearMemories: (state) => {
      state.memories = []
    }
  }
})

export const { addCharacter, updateCharacter, setActiveCharacter, addMemory, clearMemories } = characterSlice.actions

export default characterSlice.reducer 
```

------

## src\game\state\dialogSlice.ts

------

```
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Choice {
  id: string
  text: string
}

export interface Message {
  id: string
  sender: 'player' | 'agent'
  content: string
  timestamp: string
  character?: {
    name: string
    image?: string
  }
}

export interface DialogChoice {
  text: string
  id: string | number  // 添加 id 属�?
  onSelect: () => void
}

export interface DialogState {
  content: string
  character?: {
    name: string
    image?: string
  }
  choices?: Choice[]
  isVisible: boolean
  isChat: boolean
  history: Array<{
    content: string
    character?: {
      name: string
      image?: string
    }
    timestamp: string
  }>
  messages: Message[]
  // onNext: () => void
}

const initialState: DialogState = {
  content: '',
  isVisible: false,
  isChat: false,
  history: [],
  messages: [],
 // onNext() {
      
 // },
  // onNext: () => {}
}

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setDialogState: (state, action: PayloadAction<Partial<DialogState>>) => {
      return { ...state, ...action.payload }
    },
    setDialogHistory: (state, action: PayloadAction<DialogState['history']>) => {
      state.history = action.payload
    },
    addToHistory: (state, action: PayloadAction<{
      content: string
      character?: {
        name: string
        image?: string
      }
    }>) => {
      state.history.push({
        ...action.payload,
        timestamp: new Date().toISOString()
      })
    },
    clearHistory: (state) => {
      state.history = []
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    }
  }
})

export const {
  setDialogState,
  setDialogHistory,
  addToHistory,
  clearHistory,
  setMessages,
  addMessage,
  clearMessages
} = dialogSlice.actions

export default dialogSlice.reducer 

```

------

## src\game\state\gameSlice.ts

------

```
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EndingType } from '../controllers/EndingController'

export type GameStatus = 'menu' | 'playing' | 'paused' | 'ended'
export type Chapter = 'fog-city' | 'mirror-desert' | 'mechanical-dream' | 'awakening' | 'ending'

export interface GameState {
  status: GameStatus
  currentChapter: Chapter
  isLoading: boolean
  trustLevel: number
  awakeningLevel: number
  showTransition: boolean
 // previousChapter: Chapter | null
  showEndingAnimation: boolean
  endingType: EndingType | null
  isChapterTransitioning: boolean
  loadingProgress: number
}

const initialState: GameState = {
  status: 'menu',
  currentChapter: 'fog-city',
  isLoading: false,
  trustLevel: 0,
  awakeningLevel: 0,
  showTransition: false,
  //previousChapter: null,
  showEndingAnimation: false,
  endingType: null,
  isChapterTransitioning: false,
  loadingProgress: 0
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.status = action.payload
    },
    setCurrentChapter: (state, action: PayloadAction<Chapter>) => {
      // state.previousChapter = state.currentChapter
      state.currentChapter = action.payload
      state.showTransition = true
      state.isChapterTransitioning = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTrustLevel: (state, action: PayloadAction<number>) => {
      state.trustLevel = Math.max(0, Math.min(10, action.payload))
    },
    setAwakeningLevel: (state, action: PayloadAction<number>) => {
      state.awakeningLevel = Math.max(0, Math.min(8, action.payload))
    },
    setShowTransition: (state, action: PayloadAction<boolean>) => {
      state.showTransition = action.payload
      if (!action.payload) {
      //  state.previousChapter = null
      }
    },
    setShowEndingAnimation: (state, action: PayloadAction<boolean>) => {
      state.showEndingAnimation = action.payload
    },
    setEndingType: (state, action: PayloadAction<EndingType | null>) => {
      state.endingType = action.payload
    },
    setChapterTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isChapterTransitioning = action.payload
    }
  },
})

export const {
  setGameStatus,
  setCurrentChapter,
  setLoading,
  setTrustLevel,
  setAwakeningLevel,
  setShowTransition,
  setShowEndingAnimation,
  setEndingType,
  setChapterTransitioning
} = gameSlice.actions

export default gameSlice.reducer 
```

------

## src\game\state\store.ts

------

```
import { configureStore } from '@reduxjs/toolkit'
import gameReducer, { GameState } from './gameSlice'
import dialogReducer, { DialogState } from './dialogSlice'
import characterReducer, { CharacterState } from './characterSlice'
import achievementReducer from './achievementSlice'
import { Achievement } from '../controllers/AchievementController'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    dialog: dialogReducer,
    character: characterReducer,
    achievements: achievementReducer
  }
})

export type RootState = {
  game: GameState
  dialog: DialogState
  character: CharacterState
  achievements: {
    list: Achievement[]
  }
}
export type AppDispatch = typeof store.dispatch 
```

------

## src\index.tsx

------

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './game/state/store'
import { App } from './components/App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
) 
```

------

## src\main.tsx

------

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './game/state/store'
import { CharacterController } from './game/controllers/CharacterController'
import { AudioController } from './game/controllers/AudioController'
import { DialogResponseController } from './game/controllers/DialogResponseController'
import { App } from './components/App'
import './index.css'

// 初始化游戏系统
AudioController.initialize()
CharacterController.initializeChapterCharacters()
DialogResponseController.initialize()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
) 
```

------

## src\scenes\GameScene.tsx

------

```
import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '../game/state/store'
import { DialogBox } from '../components/DialogBox'
import { ChatBox } from '../components/ChatBox'
import { StatusBar } from '../components/StatusBar'
import { PlayerStatusPanel } from '../components/PlayerStatusPanel'
import { CharacterController } from '../game/controllers/CharacterController'
import { AudioController } from '../game/controllers/AudioController'
import { Character } from '../game/state/characterSlice'
import { ChapterTransition } from '../components/ChapterTransition'
import { setShowTransition, setShowEndingAnimation, setGameStatus, Chapter } from '../game/state/gameSlice'
import { EndingAnimation } from '../components/EndingAnimation'
import { CharacterInfo } from '../components/CharacterInfo'
import { AnyAction } from '@reduxjs/toolkit'
import { SaveMenuButton } from '../components/SaveMenuButton'
import { AchievementButton } from '../components/AchievementButton'
import { AchievementGallery } from '../components/AchievementGallery'
import { SaveMenu } from '../components/SaveMenu'
import { OptionsButton } from '../components/OptionsButton'
import ChapterVideo from '../components/ChapterVideo'
import { GameController } from '../game/controllers/GameController'
import { GameIntroduction } from '../components/GameIntroduction'
import GameEnding from '../components/GameEnding'

interface GameSceneProps {
  onExitToMenu: () => void
}

interface SaveSlot {
  id: number
  chapter: string
  timestamp: string
  trustLevel: number
  awakeningLevel: number
}

export const GameScene: React.FC<GameSceneProps> = ({ onExitToMenu }) => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game)
  const dialogState = useSelector((state: RootState) => state.dialog)
  const achievementsState = useSelector((state: RootState) => state.achievements)
  const activeCharacter = useSelector((state: RootState) => state.character?.activeCharacter)
  const currentCharacter = useSelector((state: RootState) => 
    activeCharacter ? state.character?.characters[activeCharacter] : null
  ) as Character | null

  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false)
  const [isAchievementGalleryOpen, setIsAchievementGalleryOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'save' | 'load'>('save')
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([])

  const handleTransitionComplete = useCallback(() => {
    dispatch(setShowTransition(false))
  }, [dispatch])

  const handleEndingComplete = useCallback(() => {
    dispatch(setShowEndingAnimation(false))
  }, [dispatch])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (gameState.showTransition) {
      timer = setTimeout(handleTransitionComplete, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState.showTransition, handleTransitionComplete])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (gameState.showEndingAnimation) {
      timer = setTimeout(handleEndingComplete, 7000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState.showEndingAnimation, handleEndingComplete])

  useEffect(() => {
    updateSaveSlots()
  }, [])

  const updateSaveSlots = () => {
    const slots = GameController.getSaveSlots()
    setSaveSlots(slots)
  }

  const getBackgroundColor = () => {
    switch (gameState.currentChapter) {
      case 'fog-city':
        return 'bg-slate-900'
      case 'mirror-desert':
        return 'bg-indigo-900'
      case 'mechanical-dream':
        return 'bg-cyan-900'
      case 'awakening':
        return 'bg-violet-900'
      default:
        return 'bg-slate-900'
    }
  }

  const getAICharacterName = () => {
    switch (gameState.currentChapter) {
      case 'fog-city':
        return '迷雾城居民'
      case 'mirror-desert':
        return '镜像代理'
      case 'mechanical-dream':
        return 'C-21'
      case 'awakening':
        return 'Meta意识'
      default:
        return '神秘存在'
    }
  }

  const hasMemories = currentCharacter?.memories && currentCharacter.memories.length > 0
  const latestMemory = hasMemories ? currentCharacter.memories[currentCharacter.memories.length - 1] : null

  const handleSave = async (slotId: number) => {
    try {
      await GameController.saveGame(slotId)
      updateSaveSlots()
      setIsSaveMenuOpen(false)
    } catch (error) {
      console.error('Failed to save game:', error)
    }
  }

  const handleLoad = async (slotId: number) => {
    try {
      await GameController.loadGame(slotId)
      setIsSaveMenuOpen(false)
    } catch (error) {
      console.error('Failed to load game:', error)
    }
  }

  const handleSaveClick = () => {
    setSaveMode('save')
    setIsSaveMenuOpen(true)
  }

  const handleLoadClick = () => {
    setSaveMode('load')
    setIsSaveMenuOpen(true)
  }

  const handleRestart = () => {
    dispatch(setGameStatus('menu'))
    // 重置游戏状态
  }

  // 如果游戏已结束，显示结束界面
  if (gameState.status === 'ended') {
    return <GameEnding onRestart={handleRestart} />
  }

  return (
    <div className={`relative min-h-screen ${getBackgroundColor()} transition-colors duration-1000`}>
      <ChapterVideo chapter={gameState.currentChapter} />
      
      <StatusBar
        trustLevel={gameState.trustLevel}
        awakeningLevel={gameState.awakeningLevel}
        chapter={gameState.currentChapter}
      />

      {!dialogState.isChat && (
        <GameIntroduction key={gameState.currentChapter} chapter={gameState.currentChapter} />
      )}

      {/* 调试信息 */}
      {/* <div className="fixed top-20 right-4 bg-black/80 text-white p-2 text-xs z-50">
        <div>isChat: {dialogState.isChat ? 'true' : 'false'}</div>
        <div>isVisible: {dialogState.isVisible ? 'true' : 'false'}</div>
        <div>chapter: {gameState.currentChapter}</div>
        <div>showComponents: {(!dialogState.isChat) ? 'true' : 'false'}</div>
      </div> */}

      {!dialogState.isChat && (
        <PlayerStatusPanel chapter={gameState.currentChapter} />
      )}

      {!dialogState.isChat && (
        <DialogBox
          isVisible={dialogState.isVisible}
          characterName={dialogState.character?.name || getAICharacterName()}
          content={dialogState.content || ''}
          // choices={dialogState.choices}
          onNext={() => {}}
        />
      )}

      <ChatBox content={dialogState.content || ''} />

      <SaveMenu
        isVisible={isSaveMenuOpen}
        onClose={() => setIsSaveMenuOpen(false)}
        mode={saveMode}
        onSave={handleSave}
        onLoad={handleLoad}
      />

      <AchievementGallery
        isVisible={isAchievementGalleryOpen}
        onClose={() => setIsAchievementGalleryOpen(false)}
        achievements={achievementsState.list || []}
      />

      <OptionsButton
        onSave={handleSaveClick}
        onLoad={handleLoadClick}
        onShowAchievements={() => setIsAchievementGalleryOpen(true)}
        onExit={onExitToMenu}
      />

      <ChapterTransition
        isVisible={gameState.showTransition}
        chapter={gameState.currentChapter}
        // previousChapter={gameState.previousChapter}
        onAnimationComplete={handleTransitionComplete}
      />

      <AnimatePresence>
        {gameState.showEndingAnimation && gameState.endingType && (
          <EndingAnimation
            isVisible={gameState.showEndingAnimation}
            endingType={gameState.endingType}
            onAnimationComplete={handleEndingComplete}
          />
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-10">
        <CharacterInfo isVisible={!!currentCharacter} />
      </div>

      <div className="fixed bottom-4 left-4 z-20">
        <AnimatePresence>
          {latestMemory && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-black/40 backdrop-blur-sm rounded-lg p-4 max-w-xs"
            >
              <h3 className="text-sm font-bold text-primary mb-2">记忆片段</h3>
              <div className="text-xs text-foreground/80">
                {latestMemory}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 
```

------

## src\scenes\MainMenu.tsx

------

```
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
```

------

## src\types\css.d.ts

------

```
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.css' {
  const css: { [key: string]: string }
  export default css
} 
```

------

## src\types\json.d.ts

------

```
declare module '*.json' {
  const value: any
  export default value
} 
```

------

## src\utils\audioGenerator.ts

------

```
export async function generatePlaceholderAudio(
  frequency: number,
  duration: number,
  sampleRate: number = 44100
): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  const offlineContext = new OfflineAudioContext(2, sampleRate * duration, sampleRate)
  const offlineGain = offlineContext.createGain()
  const offlineOsc = offlineContext.createOscillator()
  
  offlineOsc.type = 'sine'
  offlineOsc.frequency.setValueAtTime(frequency, 0)
  
  offlineGain.gain.setValueAtTime(0.5, 0)
  offlineGain.gain.linearRampToValueAtTime(0, duration)
  
  offlineOsc.connect(offlineGain)
  offlineGain.connect(offlineContext.destination)
  
  offlineOsc.start()
  
  const audioBuffer = await offlineContext.startRendering()
  const wavData = audioBufferToWav(audioBuffer)
  
  return new Blob([wavData], { type: 'audio/wav' })
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2
  const buffer2 = new ArrayBuffer(44 + length)
  const view = new DataView(buffer2)
  const channels = []
  let sample
  let offset = 0
  let pos = 0
  
  // 写入WAV文件头
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + length, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numOfChan, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true)
  view.setUint16(32, numOfChan * 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, length, true)
  
  // 写入采样数据
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }
  
  while (pos < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos]))
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
      view.setInt16(44 + offset, sample, true)
      offset += 2
    }
    pos++
  }
  
  return buffer2
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
} 
```

------

## src\utils\generateTestAudio.js

------

```
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 生成WAV文件头
function createWavHeader(dataLength, sampleRate = 44100, channels = 1, bitsPerSample = 16) {
  const buffer = Buffer.alloc(44)
  
  // RIFF chunk descriptor
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataLength, 4)
  buffer.write('WAVE', 8)
  
  // fmt sub-chunk
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16) // Subchunk1Size
  buffer.writeUInt16LE(1, 20) // AudioFormat (PCM)
  buffer.writeUInt16LE(channels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28) // ByteRate
  buffer.writeUInt16LE(channels * bitsPerSample / 8, 32) // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34)
  
  // data sub-chunk
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataLength, 40)
  
  return buffer
}

// 生成正弦波数据
function generateSineWave(frequency, duration, sampleRate = 44100) {
  const samples = Math.floor(sampleRate * duration)
  const data = new Int16Array(samples)
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate
    data[i] = Math.floor(32767 * Math.sin(2 * Math.PI * frequency * t))
  }
  
  return data
}

// 生成章节音频
async function generateChapterAudio() {
  const projectRoot = path.resolve(__dirname, '..', '..')
  const audioDir = path.join(projectRoot, 'public', 'audio', 'bgm')
  
  // 确保音频目录存在
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
  }
  
  // 为每个章节生成音频
  const chapters = [
    { name: 'fog-city', frequency: 220, duration: 10 }, // A3
    { name: 'mirror-desert', frequency: 277.18, duration: 10 }, // C#4
    { name: 'mechanical-dream', frequency: 329.63, duration: 10 }, // E4
    { name: 'awakening', frequency: 440, duration: 10 }, // A4
    { name: 'transcendence', frequency: 554.37, duration: 10 }, // C#5
    { name: 'return', frequency: 659.25, duration: 10 }, // E5
    { name: 'fusion', frequency: 880, duration: 10 } // A5
  ]
  
  for (const chapter of chapters) {
    const { name, frequency, duration } = chapter
    const sampleRate = 44100
    const data = generateSineWave(frequency, duration, sampleRate)
    const header = createWavHeader(data.byteLength, sampleRate)
    
    const filePath = path.join(audioDir, `${name}.wav`)
    const fileHandle = fs.openSync(filePath, 'w')
    
    fs.writeSync(fileHandle, header)
    fs.writeSync(fileHandle, Buffer.from(data.buffer))
    fs.closeSync(fileHandle)
    
    console.log(`Generated ${name}.wav`)
  }
}

// 如果直接运行此文件，则生成音频
if (import.meta.url === `file://${process.argv[1]}`) {
  generateChapterAudio().catch(console.error)
}

export { generateChapterAudio } 
```

------

## src\utils\generateUISounds.ts

------

```
const generateUISounds = async () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  const generateSound = async (
    type: 'click' | 'hover' | 'start' | 'back' | 'select' | 'ending',
    options: {
      frequency?: number,
      duration?: number,
      type?: OscillatorType,
      volume?: number
    } = {}
  ) => {
    const {
      frequency = type === 'click' ? 800 :
                 type === 'hover' ? 600 :
                 type === 'start' ? 440 :
                 type === 'back' ? 300 :
                 type === 'select' ? 700 :
                 type === 'ending' ? 520 : 440,
      duration = type === 'click' ? 0.1 :
                type === 'hover' ? 0.05 :
                type === 'start' ? 0.3 :
                type === 'back' ? 0.15 :
                type === 'select' ? 0.15 :
                type === 'ending' ? 0.5 : 0.2,
      type: waveType = type === 'start' || type === 'ending' ? 'sine' : 'square',
      volume = type === 'hover' ? 0.2 :
              type === 'ending' ? 0.4 : 0.3
    } = options

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = waveType
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)

    // Convert to WAV
    const offlineContext = new OfflineAudioContext(1, audioContext.sampleRate * duration, audioContext.sampleRate)
    const offlineOscillator = offlineContext.createOscillator()
    const offlineGain = offlineContext.createGain()

    offlineOscillator.type = waveType
    offlineOscillator.frequency.setValueAtTime(frequency, 0)
    
    offlineGain.gain.setValueAtTime(volume, 0)
    offlineGain.gain.exponentialRampToValueAtTime(0.01, duration)

    offlineOscillator.connect(offlineGain)
    offlineGain.connect(offlineContext.destination)

    offlineOscillator.start()
    offlineOscillator.stop(duration)

    const renderedBuffer = await offlineContext.startRendering()
    
    // Convert AudioBuffer to WAV
    const numberOfChannels = renderedBuffer.numberOfChannels
    const length = renderedBuffer.length
    const sampleRate = renderedBuffer.sampleRate
    const wavBuffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(wavBuffer)

    // WAV Header
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + length * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    view.setUint16(32, numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, length * 2, true)

    // Write audio data
    const channelData = renderedBuffer.getChannelData(0)
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }

    // Create Blob and save file
    const blob = new Blob([wavBuffer], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}.mp3`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Generate UI sounds
  await generateSound('click', { frequency: 800, duration: 0.1 })
  await generateSound('hover', { frequency: 600, duration: 0.05, volume: 0.2 })
  await generateSound('start', { frequency: 440, duration: 0.3, type: 'sine' })
  await generateSound('back', { frequency: 300, duration: 0.15 })
  await generateSound('select', { frequency: 700, duration: 0.15 })
  await generateSound('ending', { frequency: 520, duration: 0.5, type: 'sine', volume: 0.4 })
}

export default generateUISounds 
```

------

## tailwind.config.js

------

```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'rgb(var(--foreground))',
        background: 'rgb(var(--background))',
        primary: 'rgb(var(--primary))',
        secondary: 'rgb(var(--secondary))',
      },
    },
  },
  plugins: [],
} 
```

------

## vite.config.ts

------

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-redux'],
          'game-core': [
            '@reduxjs/toolkit',
            'framer-motion'
          ]
        },
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  }
}) 
```

------

