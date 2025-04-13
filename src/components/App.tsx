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
        <LoadingScreen />
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