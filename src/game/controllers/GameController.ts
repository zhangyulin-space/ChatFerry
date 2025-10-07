import { store } from '../state/store'
import { setCurrentChapter, setTrustLevel, setAwakeningLevel, setGameStatus, Chapter } from '../state/gameSlice'
import { DialogResponseController } from './DialogResponseController'
import { EndingController, EndingType } from './EndingController'
import { SaveController } from './SaveController'
import { AudioController } from './AudioController'
import { ChapterSummaryController } from './ChapterSummaryController'
import { checkChapterTransition, checkEndingCondition } from '../config/chapterConfig'
import { validateAndClampStateValues } from '../config/gameThresholds'
import { ConfigManager } from '../config/ConfigManager'

export class GameController {
  static async startNewGame(): Promise<void> {
    console.log('GameController.startNewGame() 开始')
    
    // 初始化游戏配置
    console.log('初始化游戏配置...')
    ConfigManager.initialize()
    
    // 重置游戏状态
    console.log('重置游戏状态到初始值')
    store.dispatch(setCurrentChapter('fog-city'))
    store.dispatch(setTrustLevel(0))
    store.dispatch(setAwakeningLevel(0))
    
    console.log('当前游戏状态:', store.getState().game)
    
    // 初始化对话系统
    console.log('初始化对话系统...')
    await DialogResponseController.initialize()
    
    // 开始第一章对话
    console.log('开始迷雾城章节对话...')
    await DialogResponseController.startChapterDialog('fog-city')
    
    // 播放第一章背景音乐
    console.log('播放迷雾城背景音乐...')
    await AudioController.playChapterBGM('fog-city')

    // 创建初始存档
    console.log('创建初始存档...')
    await SaveController.autoSave()
    
    console.log('GameController.startNewGame() 完成')
  }

  static async startChapter(chapter: Chapter): Promise<void> {
    console.log(`GameController.startChapter(${chapter}) 开始`)
    
    // 停止当前背景音乐
    await AudioController.stopBgm()
    
    console.log(`设置当前章节为: ${chapter}`)
    store.dispatch(setCurrentChapter(chapter))
    
    console.log('章节设置后的游戏状态:', store.getState().game)
    
    if (chapter === 'awakening') {
      // 在最终章节中特别处理结局可能性
      console.log('觉醒章节，检查结局可能性...')
      try {
        await this.checkEndingPossibility()
      } catch (error) {
        console.error('检查结局可能性时出错，开始正常对话:', error)
        // 如果检查结局失败，开始正常对话
        await DialogResponseController.startChapterDialog(chapter)
      }
    } else if (chapter !== 'ending') {
      console.log(`开始${chapter}章节对话...`)
      await DialogResponseController.startChapterDialog(chapter)
    }

    // 播放新章节背景音乐
    console.log(`播放${chapter}章节背景音乐...`)
    await AudioController.playChapterBGM(chapter)

    // 章节开始时自动存档
    console.log('章节开始，自动存档...')
    await SaveController.autoSave()
    
    console.log(`GameController.startChapter(${chapter}) 完成`)
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
    const currentChapter = state.game.currentChapter
    
    // 使用统一配置系统验证和限制状态值
    const { trustLevel: newTrustLevel, awakeningLevel: newAwakeningLevel } = validateAndClampStateValues(
      currentChapter,
      state.game.trustLevel + trustChange,
      state.game.awakeningLevel + awakeningChange
    )

    store.dispatch(setTrustLevel(newTrustLevel))
    store.dispatch(setAwakeningLevel(newAwakeningLevel))

    console.log(`状态更新: 信任度 ${state.game.trustLevel} -> ${newTrustLevel}, 觉醒值 ${state.game.awakeningLevel} -> ${newAwakeningLevel}`)

    // 检查是否满足游戏结束条件
    if (checkEndingCondition(currentChapter, newTrustLevel, newAwakeningLevel)) {
      console.log('满足游戏结束条件')
      store.dispatch(setGameStatus('ended'))
      return
    }

    // 检查章节总结条件（包括第四章节）
    if (ChapterSummaryController.shouldShowSummary(currentChapter, newTrustLevel, newAwakeningLevel)) {
      console.log(`满足章节总结条件: ${currentChapter}`)
      ChapterSummaryController.showSummary(currentChapter)
      return
    }

    // 特殊处理：在awakening章节中，不检查章节跳转条件
    if (currentChapter === 'awakening') {
      console.log('在觉醒章节中，跳过章节跳转检查')
    } else {
      // 检查章节跳转条件
      const nextChapter = checkChapterTransition(currentChapter, newTrustLevel, newAwakeningLevel)
      if (nextChapter) {
        console.log(`满足章节跳转条件: ${currentChapter} -> ${nextChapter}`)
        
        // 执行章节转换（包含总结逻辑）
        await this.performChapterTransitionWithSummary(currentChapter, nextChapter, newTrustLevel, newAwakeningLevel)
      } else {
        console.log('不满足章节跳转条件')
      }
    }

    // 状态变化后自动存档
    await SaveController.autoSave()
  }

  /**
   * 执行章节转换（包含总结逻辑）
   * @param currentChapter 当前章节
   * @param nextChapter 下一章节
   * @param trustLevel 当前信任度
   * @param awakeningLevel 当前觉醒值
   */
  static async performChapterTransitionWithSummary(
    currentChapter: Chapter, 
    nextChapter: Chapter, 
    trustLevel: number, 
    awakeningLevel: number
  ): Promise<void> {
    console.log(`执行章节转换（含总结）: ${currentChapter} -> ${nextChapter}`)
    
    // 检查是否应该显示章节总结
    if (ChapterSummaryController.shouldShowSummary(currentChapter, trustLevel, awakeningLevel)) {
      console.log('显示章节总结，暂停章节转换')
      ChapterSummaryController.showSummary(currentChapter)
      // 不在这里执行章节转换，等待玩家点击继续
    } else {
      console.log('不满足总结条件，直接执行章节转换')
      await this.performChapterTransition(nextChapter)
    }
  }

  /**
   * 执行章节转换
   * @param nextChapter 下一章节
   */
  static async performChapterTransition(nextChapter: Chapter): Promise<void> {
    console.log(`执行章节转换: ${nextChapter}`)
    
    // 重置状态为0并进入下一章
    console.log('重置信任度和觉醒值为0')
    store.dispatch(setTrustLevel(0))
    store.dispatch(setAwakeningLevel(0))
    
    // 清空对话内容
    console.log('清空对话内容')
    store.dispatch({
      type: 'dialog/clearHistory'
    })
    store.dispatch({
      type: 'dialog/clearMessages'
    })
    store.dispatch({
      type: 'dialog/setDialogState',
      payload: {
        content: '',
        character: null,
        choices: [],
        isVisible: false,
        isChat: false
      }
    })
    
    await this.startChapter(nextChapter)
  }

  /**
   * 处理章节总结继续
   * @param nextChapter 下一章节
   */
  static async handleChapterSummaryContinue(nextChapter: Chapter): Promise<void> {
    console.log(`章节总结继续，前往下一章: ${nextChapter}`)
    
    // 隐藏章节总结
    ChapterSummaryController.hideSummary()
    
    // 特殊处理：如果下一章是ending，直接触发结局
    if (nextChapter === 'ending') {
      console.log('第四章节总结完成，触发结局')
      store.dispatch(setGameStatus('ended'))
      return
    }
    
    // 执行章节转换
    await this.performChapterTransition(nextChapter)
    
    // 状态变化后自动存档
    await SaveController.autoSave()
  }

  static async checkEndingPossibility(): Promise<void> {
    try {
      const possibleEnding = await EndingController.checkEndingConditions()
      
      if (possibleEnding) {
        console.log('检测到可能的结局:', possibleEnding)
        // 确认玩家是否准备好结束游戏
        try {
          await DialogResponseController.handleResponse('awakening', 'confirm_ending')
        } catch (error) {
          console.error('处理结局确认时出错:', error)
          // 如果处理失败，直接开始结局转换
          await EndingController.startEndingTransition(possibleEnding)
        }
        
        // 如果玩家确认，开始结局转换
        await EndingController.startEndingTransition(possibleEnding)
      } else {
        console.log('未检测到可能的结局，开始正常对话')
        // 如果没有检测到结局，开始正常对话
        await DialogResponseController.startChapterDialog('awakening')
      }
    } catch (error) {
      console.error('检查结局可能性时出错:', error)
      // 如果检查失败，开始正常对话
      await DialogResponseController.startChapterDialog('awakening')
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