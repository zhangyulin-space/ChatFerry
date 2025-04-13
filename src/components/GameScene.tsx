import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../game/state/store'
import { DialogBox } from './DialogBox'
import { ChatBox } from './ChatBox'
import ChapterVideo from './ChapterVideo'
import { StatusBar } from './StatusBar'
import { GameIntroduction } from './GameIntroduction'
import styles from '../styles/GameScene.module.css'

const GameScene: React.FC = () => {
  const dialogState = useSelector((state: RootState) => state.dialog)
  const chapter = useSelector((state: RootState) => state.game.currentChapter)
  const trustLevel = useSelector((state: RootState) => state.game.trustLevel)
  const awakeningLevel = useSelector((state: RootState) => state.game.awakeningLevel)

  return (
    <div className={styles.gameScene}>
      <StatusBar chapter={chapter} trustLevel={trustLevel} awakeningLevel={awakeningLevel} />
      <div className="absolute inset-0">
        <ChapterVideo chapter={chapter} />
      </div>
      <GameIntroduction chapter={chapter} />
      
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