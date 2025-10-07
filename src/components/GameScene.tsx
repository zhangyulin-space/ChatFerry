import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../game/state/store'
import { setGameStatus } from '../game/state/gameSlice'
import { ChapterSummaryController } from '../game/controllers/ChapterSummaryController'
import { GameController } from '../game/controllers/GameController'
import { DialogBox } from './DialogBox'
import { ChatBox } from './ChatBox'
import ChapterVideo from './ChapterVideo'
import { StatusBar } from './StatusBar'
import { ChapterSummary } from './ChapterSummary'
import { PlayerStatusPanel } from './PlayerStatusPanel'
import GameEnding from './GameEnding'
import styles from '../styles/GameScene.module.css'

const GameScene: React.FC = () => {
  console.log('=== GameScene 组件开始渲染 ===')
  
  // 最简单的状态获取测试
  const testState = useSelector((state: RootState) => {
    console.log('useSelector 被调用，state:', state)
    return state
  })
  
  console.log('testState 获取成功:', testState)
  
  const dispatch = useDispatch()
  
  // 获取具体状态
  const gameState = useSelector((state: RootState) => state.game)
  const dialogState = useSelector((state: RootState) => state.dialog)
  
  console.log('具体状态获取成功:', { gameState, dialogState })
  
  // 解构状态
  const { 
    status: gameStatus, 
    currentChapter: chapter, 
    trustLevel, 
    awakeningLevel, 
    showChapterSummary, 
    summaryChapter 
  } = gameState
  
  console.log('状态解构成功:', { gameStatus, chapter, trustLevel, awakeningLevel, showChapterSummary, summaryChapter })
  
  // 强制重新渲染的计数器
  const [renderCount, setRenderCount] = useState(0)
  
  // 监听 showChapterSummary 的变化
  useEffect(() => {
    console.log('useEffect 触发，showChapterSummary:', showChapterSummary)
    if (showChapterSummary) {
      console.log('检测到 showChapterSummary 变为 true，强制重新渲染')
      setRenderCount(prev => prev + 1)
    }
  }, [showChapterSummary])

  const handleRestart = () => {
    dispatch(setGameStatus('menu'))
  }

  const handleChapterSummaryContinue = async () => {
    console.log('章节总结继续', summaryChapter)
    if (!summaryChapter) {
      console.error('summaryChapter 为空，无法继续章节转换')
      return
    }
    const nextChapter = ChapterSummaryController.getNextChapter(summaryChapter)
    await GameController.handleChapterSummaryContinue(nextChapter)
  }

  // 如果游戏已结束，显示结束界面
  if (gameStatus === 'ended') {
    return <GameEnding onRestart={handleRestart} />
  }

  console.log('GameScene 准备返回 JSX')

  return (
    <div className={styles.gameScene}>
      <StatusBar chapter={chapter} trustLevel={trustLevel} awakeningLevel={awakeningLevel} />
      <div className="absolute inset-0">
        <ChapterVideo chapter={chapter} />
      </div>
      
      {/* 调试信息 */}
      <div className="absolute top-20 left-4 bg-black/70 text-white p-2 rounded text-xs z-50">
        <div>当前章节: {chapter}</div>
        <div>信任度: {trustLevel}</div>
        <div>觉醒值: {awakeningLevel}</div>
        <div>显示总结: {showChapterSummary ? '是' : '否'}</div>
        <div>总结章节: {summaryChapter || '无'}</div>
        <div>ChapterSummary渲染: {showChapterSummary && summaryChapter ? '是' : '否'}</div>
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

      {/* 章节总结组件 */}
      {showChapterSummary && summaryChapter && (
        <ChapterSummary
          isVisible={showChapterSummary}
          currentChapter={summaryChapter}
          onContinue={handleChapterSummaryContinue}
        />
      )}
      
      {/* 调试：章节总结渲染条件 */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        left: '16px',
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        border: '2px solid red'
      }}>
        <div>showChapterSummary: {String(showChapterSummary)}</div>
        <div>summaryChapter: {String(summaryChapter)}</div>
        <div>渲染条件: {String(showChapterSummary && summaryChapter)}</div>
        <div>渲染计数: {renderCount}</div>
        <div>NODE_ENV: {process.env.NODE_ENV}</div>
        <div>时间: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}

export default GameScene 