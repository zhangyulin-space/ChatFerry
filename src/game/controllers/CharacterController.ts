import { store } from '../state/store'
import { 
  setActiveCharacter,
  addCharacter as addCharacterAction,
  addMemory as addMemoryAction,
  Character,
  CharacterType
} from '../state/characterSlice'

export const CharacterController = {
  initializeCharacter: (
    id: string,
    name: string,
    type: CharacterType,
    initialMemory?: string
  ) => {
    const character: Character = {
      id,
      name,
      type,
      memories: initialMemory ? [initialMemory] : [],
      trustLevel: 0,
      awakeningLevel: 0
    }
    
    store.dispatch(addCharacterAction(character))
  },

  setActiveCharacter: (characterId: string) => {
    store.dispatch(setActiveCharacter(characterId))
  },

  addMemory: async (memory: string) => {
    const state = store.getState()
    const activeCharacter = state.character.activeCharacter
    
    if (activeCharacter) {
      store.dispatch(addMemoryAction(memory))
    }
  },

  getCharacterState: (characterId: string) => {
    const state = store.getState()
    return state.character.characters[characterId]
  },

  initializeChapterCharacters: () => {
    // 初始化第一章角色
    CharacterController.initializeCharacter('lonely-resident', '孤独的居民', 'resident')
    CharacterController.initializeCharacter('mirror-agent', '镜像代理', 'skeptic')
    CharacterController.initializeCharacter('c-21', 'C-21', 'ai')
    CharacterController.initializeCharacter('meta-consciousness', 'Meta意识', 'ai')
  }
} 