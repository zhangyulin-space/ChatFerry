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