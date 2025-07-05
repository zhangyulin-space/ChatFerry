import { Chapter } from '../state/gameSlice'

export interface ChapterThreshold {
  trustLevel: number
  awakeningLevel: number
}

export interface ChapterTransition {
  from: Chapter
  to: Chapter
  threshold: ChapterThreshold
}

// 章节跳转配置
export const CHAPTER_TRANSITIONS: ChapterTransition[] = [
  {
    from: 'fog-city',
    to: 'mirror-desert',
    threshold: {
      trustLevel: 10,
      awakeningLevel: 8
    }
  },
  {
    from: 'mirror-desert',
    to: 'mechanical-dream',
    threshold: {
      trustLevel: 10,
      awakeningLevel: 8
    }
  },
  {
    from: 'mechanical-dream',
    to: 'awakening',
    threshold: {
      trustLevel: 10,
      awakeningLevel: 8
    }
  },
  {
    from: 'awakening',
    to: 'ending',
    threshold: {
      trustLevel: 2,
      awakeningLevel: 2
    }
  }
]

// 游戏结束条件
export const ENDING_THRESHOLD: ChapterThreshold = {
  trustLevel: 2,
  awakeningLevel: 2
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
  const transition = getChapterTransition(currentChapter)
  if (!transition) return null
  
  if (trustLevel >= transition.threshold.trustLevel && 
      awakeningLevel >= transition.threshold.awakeningLevel) {
    return transition.to
  }
  
  return null
}

// 检查是否满足游戏结束条件
export function checkEndingCondition(
  currentChapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): boolean {
  return currentChapter === 'awakening' && 
         trustLevel >= ENDING_THRESHOLD.trustLevel && 
         awakeningLevel >= ENDING_THRESHOLD.awakeningLevel
} 