import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '../game/state/store'
import { DialogResponseController } from '../game/controllers/DialogResponseController'
import { AudioController } from '../game/controllers/AudioController'
import { Message, addMessage } from '../game/state/dialogSlice'

interface ChatBoxProps {
  content: string
}

export const ChatBox: React.FC<ChatBoxProps> = ({ content }) => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const gameState = useSelector((state: RootState) => state.game)
  const dialogState = useSelector((state: RootState) => state.dialog)
  const messages = useSelector((state: RootState) => state.dialog.messages)

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
              正在输入...
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