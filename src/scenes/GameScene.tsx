import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '../game/state/store'
import { DialogBox } from '../components/DialogBox'
import { ChatBox } from '../components/ChatBox'
import { StatusBar } from '../components/StatusBar'
import { CharacterController } from '../game/controllers/CharacterController'
import { AudioController } from '../game/controllers/AudioController'
import { Character } from '../game/state/characterSlice'
import { ChapterTransition } from '../components/ChapterTransition'
import { setShowTransition, setShowEndingAnimation, Chapter } from '../game/state/gameSlice'
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

  return (
    <div className={`relative min-h-screen ${getBackgroundColor()} transition-colors duration-1000`}>
      <ChapterVideo chapter={gameState.currentChapter} />
      
      <StatusBar
        trustLevel={gameState.trustLevel}
        awakeningLevel={gameState.awakeningLevel}
        chapter={gameState.currentChapter}
      />

      {!dialogState.isChat && (
        <DialogBox
          isVisible={dialogState.isVisible}
          characterName={dialogState.character?.name}
          content={dialogState.content || ''}
          choices={dialogState.choices}
          onNext={dialogState.onNext}
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
        previousChapter={gameState.previousChapter}
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