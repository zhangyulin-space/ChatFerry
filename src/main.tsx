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