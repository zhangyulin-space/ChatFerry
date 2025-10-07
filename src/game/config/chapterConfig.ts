import { Chapter } from '../state/gameSlice'
import { 
  getChapterTransitionThreshold, 
  checkChapterTransitionCondition,
  checkGameEndingCondition,
  validateConfiguration 
} from './gameThresholds'

export interface ChapterThreshold {
  trustLevel: number
  awakeningLevel: number
}

export interface ChapterTransition {
  from: Chapter
  to: Chapter
  threshold: ChapterThreshold
}

// 章节跳转配置 - 使用统一配置系统
export const CHAPTER_TRANSITIONS: ChapterTransition[] = [
  {
    from: 'fog-city',
    to: 'mirror-desert',
    threshold: getChapterTransitionThreshold('fog-city') || { trustLevel: 10, awakeningLevel: 8 }
  },
  {
    from: 'mirror-desert',
    to: 'mechanical-dream',
    threshold: getChapterTransitionThreshold('mirror-desert') || { trustLevel: 12, awakeningLevel: 9 }
  },
  {
    from: 'mechanical-dream',
    to: 'awakening',
    threshold: getChapterTransitionThreshold('mechanical-dream') || { trustLevel: 14, awakeningLevel: 10 }
  }
  // 移除觉醒章节的转换配置，因为觉醒章节是最终章节
]

// 游戏结束条件 - 使用统一配置系统
export const ENDING_THRESHOLD: ChapterThreshold = {
  trustLevel: 15,
  awakeningLevel: 12
}

// 获取章节跳转配置
export function getChapterTransition(currentChapter: Chapter): ChapterTransition | null {
  return CHAPTER_TRANSITIONS.find(transition => transition.from === currentChapter) || null
}

// 检查是否满足章节跳转条件
export function checkChapterTransition(
  currentChapter: Chapter, 
  trustLevel: number, 
  awakeningLevel: number
): Chapter | null {
  console.log(`检查章节转换: 章节=${currentChapter}, 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
  
  const transition = getChapterTransition(currentChapter)
  if (!transition) {
    console.log(`未找到章节转换配置: ${currentChapter}`)
    return null
  }
  
  console.log(`章节转换阈值: 信任度>=${transition.threshold.trustLevel}, 觉醒值>=${transition.threshold.awakeningLevel}`)
  
  // 使用统一配置系统的检查函数
  if (checkChapterTransitionCondition(currentChapter, trustLevel, awakeningLevel)) {
    console.log(`满足章节转换条件: ${currentChapter} -> ${transition.to}`)
    return transition.to
  } else {
    console.log(`不满足章节转换条件: 信任度>=${transition.threshold.trustLevel}(${trustLevel >= transition.threshold.trustLevel}), 觉醒值>=${transition.threshold.awakeningLevel}(${awakeningLevel >= transition.threshold.awakeningLevel})`)
  }
  
  return null
}

// 检查是否满足游戏结束条件
export function checkEndingCondition(
  currentChapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): boolean {
  // 使用统一配置系统的检查函数
  return checkGameEndingCondition(currentChapter, trustLevel, awakeningLevel)
} 