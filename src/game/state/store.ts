import { configureStore } from '@reduxjs/toolkit'
import gameReducer, { GameState } from './gameSlice'
import dialogReducer, { DialogState } from './dialogSlice'
import characterReducer, { CharacterState } from './characterSlice'
import achievementReducer from './achievementSlice'
import { Achievement } from '../controllers/AchievementController'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    dialog: dialogReducer,
    character: characterReducer,
    achievements: achievementReducer
  }
})

export type RootState = {
  game: GameState
  dialog: DialogState
  character: CharacterState
  achievements: {
    list: Achievement[]
  }
}
export type AppDispatch = typeof store.dispatch 