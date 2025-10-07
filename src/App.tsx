import React from 'react'
import { Provider } from 'react-redux'
import { store } from './game/state/store'

const App: React.FC = () => {
  console.log('=== App 组件开始渲染 ===')
  
  return (
    <Provider store={store}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'blue',
        color: 'white',
        padding: '20px',
        fontSize: '24px',
        zIndex: 99999
      }}>
        <h1>App 组件测试</h1>
        <p>如果你能看到这个蓝色页面，说明 React 应用正常工作</p>
        <p>时间: {new Date().toLocaleTimeString()}</p>
      </div>
    </Provider>
  )
}

export default App 