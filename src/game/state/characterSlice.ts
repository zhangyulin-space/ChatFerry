import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CharacterType = 'resident' | 'skeptic' | 'ai'

export interface Character {
  id: string
  name: string
  type: CharacterType
  trustLevel: number
  awakeningLevel: number
  memories: string[]
}

export interface CharacterState {
  characters: Record<string, Character>
  activeCharacter: string | null
  memories: string[]
}

const initialState: CharacterState = {
  characters: {},
  activeCharacter: null,
  memories: []
}

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters[action.payload.id] = action.payload
    },
    updateCharacter: (state, action: PayloadAction<Partial<Character> & { id: string }>) => {
      if (state.characters[action.payload.id]) {
        state.characters[action.payload.id] = {
          ...state.characters[action.payload.id],
          ...action.payload,
        }
      }
    },
    setActiveCharacter: (state, action: PayloadAction<string | null>) => {
      state.activeCharacter = action.payload
    },
    addMemory: (state, action: PayloadAction<string>) => {
      state.memories.push(action.payload)
    },
    clearMemories: (state) => {
      state.memories = []
    }
  }
})

export const { addCharacter, updateCharacter, setActiveCharacter, addMemory, clearMemories } = characterSlice.actions

export default characterSlice.reducer 