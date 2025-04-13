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