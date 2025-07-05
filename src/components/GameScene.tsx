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