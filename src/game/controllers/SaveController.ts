import { store } from '../state/store'
import { RootState } from '../state/store'
import { setGameStatus, setCurrentChapter, setTrustLevel, setAwakeningLevel, Chapter } from '../state/gameSlice'
import { setActiveCharacter, addCharacter, Character } from '../state/characterSlice'

export interface SaveData {
  timestamp: number
  chapter: Chapter
  trustLevel: number
  awakeningLevel: number
  characters: Record<string, Character>
  activeCharacter: string | null
  version: string
}

export class SaveController {
  private static readonly SAVE_VERSION = '1.0.0'
  private static readonly MAX_SAVE_SLOTS = 5
  private static readonly SAVE_PREFIX = 'zensky_save_'
  private static readonly AUTO_SAVE_KEY = 'zensky_autosave'

  static async saveGame(slotId?: number): Promise<boolean> {
    try {
      const state = store.getState()
      const saveData: SaveData = {
        timestamp: Date.now(),
        chapter: state.game.currentChapter,
        trustLevel: state.game.trustLevel,
        awakeningLevel: state.game.awakeningLevel,
        characters: state.character.characters,
        activeCharacter: state.character.activeCharacter,
        version: this.SAVE_VERSION
      }

      const saveKey = slotId !== undefined 
        ? `${this.SAVE_PREFIX}${slotId}`
        : this.AUTO_SAVE_KEY

      localStorage.setItem(saveKey, JSON.stringify(saveData))
      console.log(`游戏已保存到槽位 ${slotId !== undefined ? slotId : '自动存档'}`)
      return true
    } catch (error) {
      console.error('保存游戏失败:', error)
      return false
    }
  }

  static async loadGame(slotId?: number): Promise<boolean> {
    try {
      const saveKey = slotId !== undefined 
        ? `${this.SAVE_PREFIX}${slotId}`
        : this.AUTO_SAVE_KEY

      const saveDataStr = localStorage.getItem(saveKey)
      if (!saveDataStr) {
        console.error('未找到存档数据')
        return false
      }

      const saveData: SaveData = JSON.parse(saveDataStr)
      
      // 版本检查
      if (saveData.version !== this.SAVE_VERSION) {
        console.warn('存档版本不匹配，可能导致兼容性问题')
      }

      // 恢复游戏状态
      store.dispatch(setGameStatus('playing'))
      store.dispatch(setCurrentChapter(saveData.chapter))
      store.dispatch(setTrustLevel(saveData.trustLevel))
      store.dispatch(setAwakeningLevel(saveData.awakeningLevel))

      // 恢复角色状态
      Object.values(saveData.characters).forEach(character => {
        store.dispatch(addCharacter(character))
      })
      
      if (saveData.activeCharacter) {
        store.dispatch(setActiveCharacter(saveData.activeCharacter))
      }

      console.log(`游戏已从槽位 ${slotId !== undefined ? slotId : '自动存档'} 加载`)
      return true
    } catch (error) {
      console.error('加载游戏失败:', error)
      return false
    }
  }

  static async autoSave(): Promise<boolean> {
    return this.saveGame()
  }

  static getSaveInfo(slotId?: number): SaveData | null {
    try {
      const saveKey = slotId !== undefined 
        ? `${this.SAVE_PREFIX}${slotId}`
        : this.AUTO_SAVE_KEY

      const saveDataStr = localStorage.getItem(saveKey)
      if (!saveDataStr) return null

      return JSON.parse(saveDataStr)
    } catch {
      return null
    }
  }

  static getAllSaves(): Array<{ slotId: number; data: SaveData | null }> {
    const saves: Array<{ slotId: number; data: SaveData | null }> = []
    
    for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
      saves.push({
        slotId: i,
        data: this.getSaveInfo(i)
      })
    }

    return saves
  }

  static deleteSave(slotId: number): boolean {
    try {
      const saveKey = `${this.SAVE_PREFIX}${slotId}`
      localStorage.removeItem(saveKey)
      return true
    } catch {
      return false
    }
  }

  static formatSaveDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  static getChapterName(chapter: Chapter): string {
    const chapterNames: Record<Chapter, string> = {
      'fog-city': '迷雾城',
      'mirror-desert': '镜像沙漠',
      'mechanical-dream': '机械梦境',
      'awakening': '觉醒'
    }
    return chapterNames[chapter]
  }
} 