import { store } from '../state/store'
import { setShowChapterSummary, setSummaryChapter, Chapter } from '../state/gameSlice'
import { checkChapterSummaryCondition } from '../config/gameThresholds'
import { AudioController } from './AudioController'

export class ChapterSummaryController {
  /**
   * 显示章节总结
   * @param chapter 要总结的章节
   */
  static showSummary(chapter: Chapter): void {
    console.log(`显示章节总结: ${chapter}`)
    
    // 设置总结章节和显示状态
    store.dispatch(setSummaryChapter(chapter))
    store.dispatch(setShowChapterSummary(true))
    
    // 验证状态更新
    const state = store.getState()
    console.log(`状态更新验证: showChapterSummary=${state.game.showChapterSummary}, summaryChapter=${state.game.summaryChapter}`)
    
    // 延迟检查状态
    setTimeout(() => {
      const delayedState = store.getState()
      console.log(`延迟状态检查: showChapterSummary=${delayedState.game.showChapterSummary}, summaryChapter=${delayedState.game.summaryChapter}`)
    }, 100)
    
    // 播放总结音效
    AudioController.playUISound('select')
  }

  /**
   * 隐藏章节总结
   */
  static hideSummary(): void {
    console.log('隐藏章节总结')
    
    store.dispatch(setShowChapterSummary(false))
    store.dispatch(setSummaryChapter(null))
  }

  /**
   * 检查是否应该显示章节总结
   * @param currentChapter 当前章节
   * @param trustLevel 信任度
   * @param awakeningLevel 觉醒值
   * @returns 是否应该显示总结
   */
  static shouldShowSummary(
    currentChapter: Chapter, 
    trustLevel: number, 
    awakeningLevel: number
  ): boolean {
    console.log(`检查章节总结条件: 章节=${currentChapter}, 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
    
    // 使用统一配置系统检查总结条件
    const shouldShow = checkChapterSummaryCondition(currentChapter, trustLevel, awakeningLevel)
    
    console.log(`章节总结条件检查结果: ${shouldShow}`)
    
    return shouldShow
  }

  /**
   * 获取章节总结的触发条件
   * @param chapter 章节
   * @returns 触发条件描述
   */
  static getSummaryTriggerCondition(chapter: Chapter): string {
    switch (chapter) {
      case 'fog-city':
        return '信任度达到6，觉醒值达到4'
      case 'mirror-desert':
        return '信任度达到7，觉醒值达到5'
      case 'mechanical-dream':
        return '信任度达到8，觉醒值达到6'
      case 'awakening':
        return '信任度达到6，觉醒值达到5'
      default:
        return '未知条件'
    }
  }

  /**
   * 获取下一章节
   * @param currentChapter 当前章节
   * @returns 下一章节
   */
  static getNextChapter(currentChapter: Chapter): Chapter {
    switch (currentChapter) {
      case 'fog-city':
        return 'mirror-desert'
      case 'mirror-desert':
        return 'mechanical-dream'
      case 'mechanical-dream':
        return 'awakening'
      case 'awakening':
        return 'ending' // 第四章节总结后进入结局
      default:
        return 'fog-city'
    }
  }
} 