import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EndingType } from '../controllers/EndingController'

export type GameStatus = 'menu' | 'playing' | 'paused'
export type Chapter = 'fog-city' | 'mirror-desert' | 'mechanical-dream' | 'awakening'

export interface GameState {
  status: GameStatus
  currentChapter: Chapter
  isLoading: boolean
  trustLevel: number
  awakeningLevel: number
  showTransition: boolean
  previousChapter: Chapter | null
  showEndingAnimation: boolean
  endingType: EndingType | null
  isChapterTransitioning: boolean
}

const initialState: GameState = {
  status: 'menu',
  currentChapter: 'fog-city',
  isLoading: false,
  trustLevel: 0,
  awakeningLevel: 0,
  showTransition: false,
  previousChapter: null,
  showEndingAnimation: false,
  endingType: null,
  isChapterTransitioning: false
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.status = action.payload
    },
    setCurrentChapter: (state, action: PayloadAction<Chapter>) => {
      state.previousChapter = state.currentChapter
      state.currentChapter = action.payload
      state.showTransition = true
      state.isChapterTransitioning = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTrustLevel: (state, action: PayloadAction<number>) => {
      state.trustLevel = Math.max(-10, Math.min(10, action.payload))
    },
    setAwakeningLevel: (state, action: PayloadAction<number>) => {
      state.awakeningLevel = Math.max(0, Math.min(8, action.payload))
    },
    setShowTransition: (state, action: PayloadAction<boolean>) => {
      state.showTransition = action.payload
      if (!action.payload) {
        state.previousChapter = null
      }
    },
    setShowEndingAnimation: (state, action: PayloadAction<boolean>) => {
      state.showEndingAnimation = action.payload
    },
    setEndingType: (state, action: PayloadAction<EndingType | null>) => {
      state.endingType = action.payload
    },
    setChapterTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isChapterTransitioning = action.payload
    }
  },
})

export const {
  setGameStatus,
  setCurrentChapter,
  setLoading,
  setTrustLevel,
  setAwakeningLevel,
  setShowTransition,
  setShowEndingAnimation,
  setEndingType,
  setChapterTransitioning
} = gameSlice.actions

export default gameSlice.reducer 