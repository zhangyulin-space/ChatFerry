import { store } from '../state/store'
import { setCurrentChapter, setTrustLevel, setAwakeningLevel, Chapter } from '../state/gameSlice'
import { DialogResponseController } from './DialogResponseController'
import { EndingController, EndingType } from './EndingController'
import { SaveController } from './SaveController'
import { AudioController } from './AudioController'

export class GameController {
  static async startNewGame(): Promise<void> {
    // 重置游戏状态
    store.dispatch(setCurrentChapter('fog-city'))
    store.dispatch(setTrustLevel(0))
    store.dispatch(setAwakeningLevel(0))
    
    // 初始化对话系统
    await DialogResponseController.initialize()
    
    // 开始第一章对话
    await DialogResponseController.startChapterDialog('fog-city')
    
    // 播放第一章背景音乐
    await AudioController.playChapterBGM('fog-city')

    // 创建初始存档
    await SaveController.autoSave()
  }

  static async startChapter(chapter: Chapter): Promise<void> {
    // 停止当前背景音乐
    await AudioController.stopBgm()
    
    store.dispatch(setCurrentChapter(chapter))
    
    if (chapter === 'awakening') {
      // 在最终章节中特别处理结局可能性
      await this.checkEndingPossibility()
    } else {
      await DialogResponseController.startChapterDialog(chapter)
    }

    // 播放新章节背景音乐
    await AudioController.playChapterBGM(chapter)

    // 章节开始时自动存档
    await SaveController.autoSave()
  }

  static async handleGameChoice(choiceId: string): Promise<void> {
    const state = store.getState()
    const currentChapter = state.game.currentChapter
    
    await DialogResponseController.handleResponse(currentChapter, choiceId)
    
    // 在最终章节中，每次选择后检查是否触发结局
    if (currentChapter === 'awakening') {
      await this.checkEndingPossibility()
    }

    // 重要选择后自动存档
    await SaveController.autoSave()
  }

  static async updateGameState(trustChange: number, awakeningChange: number): Promise<void> {
    const state = store.getState()
    const newTrustLevel = Math.max(0, Math.min(10, state.game.trustLevel + trustChange))
    const newAwakeningLevel = Math.max(0, Math.min(10, state.game.awakeningLevel + awakeningChange))

    store.dispatch(setTrustLevel(newTrustLevel))
    store.dispatch(setAwakeningLevel(newAwakeningLevel))

    // 检查章节转换条件
    const currentChapter = state.game.currentChapter
    if (currentChapter === 'fog-city' && newTrustLevel >= 10 && newAwakeningLevel >= 10) {
      // 重置状态并进入下一章
      store.dispatch(setTrustLevel(0))
      store.dispatch(setAwakeningLevel(0))
      await this.startChapter('mirror-desert')
    } else if (currentChapter === 'mirror-desert' && newTrustLevel >= 10 && newAwakeningLevel >= 10) {
      // 重置状态并进入下一章
      store.dispatch(setTrustLevel(0))
      store.dispatch(setAwakeningLevel(0))
      await this.startChapter('mechanical-dream')
    } else if (currentChapter === 'mechanical-dream' && newTrustLevel >= 10 && newAwakeningLevel >= 10) {
      // 重置状态并进入下一章
      store.dispatch(setTrustLevel(0))
      store.dispatch(setAwakeningLevel(0))
      await this.startChapter('awakening')
    }

    // 状态变化后自动存档
    await SaveController.autoSave()
  }

  static async checkEndingPossibility(): Promise<void> {
    const possibleEnding = await EndingController.checkEndingConditions()
    
    if (possibleEnding) {
      // 确认玩家是否准备好结束游戏
      await DialogResponseController.handleResponse('awakening', 'confirm_ending')
      
      // 如果玩家确认，开始结局转换
      await EndingController.startEndingTransition(possibleEnding)
    }
  }

  // 新增：直接触发特定结局（用于测试或特殊情况）
  static async triggerSpecificEnding(endingType: EndingType): Promise<void> {
    await EndingController.startEndingTransition(endingType)
  }

  // 新增：显示存档菜单
  static showSaveMenu(): void {
    // TODO: 实现存档菜单显示逻辑
  }

  // 新增：显示加载菜单
  static showLoadMenu(): void {
    // TODO: 实现加载菜单显示逻辑
  }

  static saveGame(slotId: number = 0) {
    try {
      const gameState = store.getState()
      const saveData = {
        game: gameState.game,
        character: gameState.character,
        dialog: {
          content: gameState.dialog.content,
          character: gameState.dialog.character,
          choices: gameState.dialog.choices,
          isVisible: gameState.dialog.isVisible,
          isChat: gameState.dialog.isChat,
          history: gameState.dialog.history || [],
          messages: gameState.dialog.messages || []
        },
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(`gameState_${slotId}`, JSON.stringify(saveData))
      console.log(`Game saved successfully to slot ${slotId}`)
    } catch (error) {
      console.error('Failed to save game:', error)
      throw error
    }
  }

  static async loadGame(slotId: number = 0) {
    try {
      const savedState = localStorage.getItem(`gameState_${slotId}`)
      if (savedState) {
        const saveData = JSON.parse(savedState)
        
        // 恢复游戏状态
        store.dispatch(setCurrentChapter(saveData.game.currentChapter))
        store.dispatch(setTrustLevel(saveData.game.trustLevel))
        store.dispatch(setAwakeningLevel(saveData.game.awakeningLevel))
        
        // 恢复角色状态
        if (saveData.character) {
          store.dispatch({
            type: 'character/setCharacterState',
            payload: saveData.character
          })
        }
        
        // 恢复对话状态
        if (saveData.dialog) {
          // 先清空当前对话历史和消息
          store.dispatch({
            type: 'dialog/clearHistory'
          })
          store.dispatch({
            type: 'dialog/clearMessages'
          })
          
          // 恢复对话历史
          if (saveData.dialog.history) {
            store.dispatch({
              type: 'dialog/setDialogHistory',
              payload: saveData.dialog.history
            })
          }
          
          // 恢复聊天消息
          if (saveData.dialog.messages) {
            store.dispatch({
              type: 'dialog/setMessages',
              payload: saveData.dialog.messages
            })
          }
          
          // 恢复当前对话状态，但不触发新消息
          store.dispatch({
            type: 'dialog/setDialogState',
            payload: {
              content: saveData.dialog.content,
              character: saveData.dialog.character,
              choices: saveData.dialog.choices,
              isVisible: saveData.dialog.isVisible,
              isChat: saveData.dialog.isChat
            }
          })
        }
        
        // 播放当前章节的背景音乐
        await AudioController.playChapterBGM(saveData.game.currentChapter)
        
        console.log(`Game loaded successfully from slot ${slotId}`)
      } else {
        console.log(`No saved game found in slot ${slotId}`)
        throw new Error('No saved game found')
      }
    } catch (error) {
      console.error('Failed to load game:', error)
      throw error
    }
  }

  static getSaveSlots() {
    const slots = []
    for (let i = 0; i < 5; i++) {
      const savedState = localStorage.getItem(`gameState_${i}`)
      if (savedState) {
        const saveData = JSON.parse(savedState)
        slots.push({
          id: i,
          chapter: saveData.game.currentChapter,
          timestamp: saveData.timestamp,
          trustLevel: saveData.game.trustLevel,
          awakeningLevel: saveData.game.awakeningLevel,
          dialogPreview: saveData.dialog?.content?.substring(0, 50) + '...' || '',
          hasHistory: Array.isArray(saveData.dialog?.history) && saveData.dialog.history.length > 0
        })
      }
    }
    return slots
  }
} 