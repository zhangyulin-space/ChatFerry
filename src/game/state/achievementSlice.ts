import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Achievement } from '../controllers/AchievementController'

interface AchievementState {
  list: Achievement[]
}

const initialState: AchievementState = {
  list: []
}

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.list.push(action.payload)
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.list = action.payload
    }
  }
})

export const { addAchievement, setAchievements } = achievementSlice.actions
export default achievementSlice.reducer 