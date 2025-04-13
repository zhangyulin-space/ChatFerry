import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Choice {
  id: string
  text: string
}

export interface Message {
  id: string
  sender: 'player' | 'agent'
  content: string
  timestamp: string
  character?: {
    name: string
    image?: string
  }
}

export interface DialogState {
  content: string
  character?: {
    name: string
    image?: string
  }
  choices?: Choice[]
  isVisible: boolean
  isChat: boolean
  history: Array<{
    content: string
    character?: {
      name: string
      image?: string
    }
    timestamp: string
  }>
  messages: Message[]
}

const initialState: DialogState = {
  content: '',
  isVisible: false,
  isChat: false,
  history: [],
  messages: []
}

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setDialogState: (state, action: PayloadAction<Partial<DialogState>>) => {
      return { ...state, ...action.payload }
    },
    setDialogHistory: (state, action: PayloadAction<DialogState['history']>) => {
      state.history = action.payload
    },
    addToHistory: (state, action: PayloadAction<{
      content: string
      character?: {
        name: string
        image?: string
      }
    }>) => {
      state.history.push({
        ...action.payload,
        timestamp: new Date().toISOString()
      })
    },
    clearHistory: (state) => {
      state.history = []
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    }
  }
})

export const {
  setDialogState,
  setDialogHistory,
  addToHistory,
  clearHistory,
  setMessages,
  addMessage,
  clearMessages
} = dialogSlice.actions

export default dialogSlice.reducer 