import { Chapter } from '../state/gameSlice'

// 游戏评估范围配置
export interface EvaluationRanges {
  trustLevel: {
    min: number
    max: number
  }
  awakeningLevel: {
    min: number
    max: number
  }
}

// 章节转换阈值配置
export interface ChapterTransitionThreshold {
  trustLevel: number
  awakeningLevel: number
}

// 章节总结触发阈值配置
export interface ChapterSummaryThreshold {
  trustLevel: number
  awakeningLevel: number
}

// 游戏结束阈值配置
export interface EndingThreshold {
  trustLevel: number
  awakeningLevel: number
}

// 各章节的评估范围配置
export const CHAPTER_EVALUATION_RANGES: Record<Chapter, EvaluationRanges> = {
  'fog-city': {
    trustLevel: { min: -15, max: 15 },
    awakeningLevel: { min: 0, max: 12 }
  },
  'mirror-desert': {
    trustLevel: { min: -15, max: 15 },
    awakeningLevel: { min: 0, max: 12 }
  },
  'mechanical-dream': {
    trustLevel: { min: -15, max: 15 },
    awakeningLevel: { min: 0, max: 12 }
  },
  'awakening': {
    trustLevel: { min: -10, max: 20 },
    awakeningLevel: { min: 0, max: 15 }
  },
  'ending': {
    trustLevel: { min: 0, max: 20 },
    awakeningLevel: { min: 0, max: 15 }
  }
}

// 章节转换阈值配置
export const CHAPTER_TRANSITION_THRESHOLDS: Partial<Record<Chapter, ChapterTransitionThreshold>> = {
  'fog-city': {
    trustLevel: 10,
    awakeningLevel: 8
  },
  'mirror-desert': {
    trustLevel: 12,
    awakeningLevel: 9
  },
  'mechanical-dream': {
    trustLevel: 14,
    awakeningLevel: 10
  },
  // 移除觉醒章节的转换阈值，因为觉醒章节是最终章节
  'ending': {
    trustLevel: 0,
    awakeningLevel: 0
  }
}

// 章节总结触发阈值配置
export const CHAPTER_SUMMARY_THRESHOLDS: Record<Chapter, ChapterSummaryThreshold> = {
  'fog-city': {
    trustLevel: 10,
    awakeningLevel: 8
  },
  'mirror-desert': {
    trustLevel: 12,
    awakeningLevel: 9
  },
  'mechanical-dream': {
    trustLevel: 14,
    awakeningLevel: 10
  },
  'awakening': {
    trustLevel: 8,
    awakeningLevel: 6
  },
  'ending': {
    trustLevel: 0,
    awakeningLevel: 0
  }
}

// 游戏结束阈值配置
export const GAME_ENDING_THRESHOLD: EndingThreshold = {
  trustLevel: 15,
  awakeningLevel: 12
}

// 工具函数：获取章节的评估范围
export function getChapterEvaluationRanges(chapter: Chapter): EvaluationRanges {
  return CHAPTER_EVALUATION_RANGES[chapter]
}

// 工具函数：获取章节转换阈值
export function getChapterTransitionThreshold(chapter: Chapter): ChapterTransitionThreshold | null {
  const threshold = CHAPTER_TRANSITION_THRESHOLDS[chapter]
  if (!threshold) {
    console.log(`章节 ${chapter} 没有转换阈值配置（这是正常的，如觉醒章节）`)
    return null
  }
  return threshold
}

// 工具函数：获取章节总结阈值
export function getChapterSummaryThreshold(chapter: Chapter): ChapterSummaryThreshold | null {
  return CHAPTER_SUMMARY_THRESHOLDS[chapter] || null
}

// 工具函数：检查是否满足章节转换条件
export function checkChapterTransitionCondition(
  chapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): boolean {
  const threshold = getChapterTransitionThreshold(chapter)
  if (!threshold) return false
  
  return trustLevel >= threshold.trustLevel && awakeningLevel >= threshold.awakeningLevel
}

// 工具函数：检查是否满足章节总结条件
export function checkChapterSummaryCondition(
  chapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): boolean {
  const threshold = getChapterSummaryThreshold(chapter)
  if (!threshold) return false
  
  return trustLevel >= threshold.trustLevel && awakeningLevel >= threshold.awakeningLevel
}

// 工具函数：检查是否满足游戏结束条件
export function checkGameEndingCondition(
  chapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): boolean {
  if (chapter !== 'awakening') return false
  
  return trustLevel >= GAME_ENDING_THRESHOLD.trustLevel && 
         awakeningLevel >= GAME_ENDING_THRESHOLD.awakeningLevel
}

// 工具函数：验证并限制状态值在有效范围内
export function validateAndClampStateValues(
  chapter: Chapter,
  trustLevel: number,
  awakeningLevel: number
): { trustLevel: number; awakeningLevel: number } {
  const ranges = getChapterEvaluationRanges(chapter)
  
  const clampedTrustLevel = Math.max(
    ranges.trustLevel.min,
    Math.min(ranges.trustLevel.max, trustLevel)
  )
  
  const clampedAwakeningLevel = Math.max(
    ranges.awakeningLevel.min,
    Math.min(ranges.awakeningLevel.max, awakeningLevel)
  )
  
  return {
    trustLevel: clampedTrustLevel,
    awakeningLevel: clampedAwakeningLevel
  }
}

// 工具函数：获取控制器评估提示文本
export function getControllerEvaluationPrompt(chapter: Chapter): string {
  const ranges = getChapterEvaluationRanges(chapter)
  
  return `请以下面的格式返回评估结果（确保是有效的JSON）：

当前章节：${chapter}
评估范围：
- trustChange: ${ranges.trustLevel.min} 到 ${ranges.trustLevel.max}
- awakeningChange: ${ranges.awakeningLevel.min} 到 ${ranges.awakeningLevel.max}

{
  "isRelevant": true/false,
  "trustChange": number (${ranges.trustLevel.min} 到 ${ranges.trustLevel.max}),
  "awakeningChange": number (${ranges.awakeningLevel.min} 到 ${ranges.awakeningLevel.max}),
  "reasoning": "评估理由"
}`
}

// 配置验证函数
export function validateConfiguration(): void {
  console.log('验证游戏阈值配置...')
  
  // 验证所有章节都有配置
  const chapters: Chapter[] = ['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening']
  
  for (const chapter of chapters) {
    if (!CHAPTER_EVALUATION_RANGES[chapter]) {
      console.error(`缺少章节 ${chapter} 的评估范围配置`)
    }
    if (!CHAPTER_TRANSITION_THRESHOLDS[chapter]) {
      console.log(`章节 ${chapter} 没有转换阈值配置（这是正常的，如觉醒章节）`)
    }
    if (!CHAPTER_SUMMARY_THRESHOLDS[chapter]) {
      console.error(`缺少章节 ${chapter} 的总结阈值配置`)
    }
  }
  
  // 验证阈值的合理性
  for (const chapter of chapters) {
    const ranges = CHAPTER_EVALUATION_RANGES[chapter]
    const transitionThreshold = CHAPTER_TRANSITION_THRESHOLDS[chapter]
    const summaryThreshold = CHAPTER_SUMMARY_THRESHOLDS[chapter]
    
    if (transitionThreshold && ranges) {
      if (transitionThreshold.trustLevel > ranges.trustLevel.max) {
        console.warn(`章节 ${chapter} 的转换信任度阈值超出范围`)
      }
      if (transitionThreshold.awakeningLevel > ranges.awakeningLevel.max) {
        console.warn(`章节 ${chapter} 的转换觉醒值阈值超出范围`)
      }
    }
    
    if (summaryThreshold && ranges) {
      if (summaryThreshold.trustLevel > ranges.trustLevel.max) {
        console.warn(`章节 ${chapter} 的总结信任度阈值超出范围`)
      }
      if (summaryThreshold.awakeningLevel > ranges.awakeningLevel.max) {
        console.warn(`章节 ${chapter} 的总结觉醒值阈值超出范围`)
      }
    }
  }
  
  console.log('游戏阈值配置验证完成')
}

// 导出配置信息用于调试
export function getConfigurationInfo(): string {
  let info = '游戏阈值配置信息:\n\n'
  
  const chapters: Chapter[] = ['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening']
  
  for (const chapter of chapters) {
    const ranges = CHAPTER_EVALUATION_RANGES[chapter]
    const transitionThreshold = CHAPTER_TRANSITION_THRESHOLDS[chapter]
    const summaryThreshold = CHAPTER_SUMMARY_THRESHOLDS[chapter]
    
    info += `${chapter}:\n`
    info += `  评估范围: 信任度 ${ranges.trustLevel.min}~${ranges.trustLevel.max}, 觉醒值 ${ranges.awakeningLevel.min}~${ranges.awakeningLevel.max}\n`
    if (transitionThreshold) {
      info += `  转换阈值: 信任度 ${transitionThreshold.trustLevel}, 觉醒值 ${transitionThreshold.awakeningLevel}\n`
    } else {
      info += `  转换阈值: 无（最终章节）\n`
    }
    info += `  总结阈值: 信任度 ${summaryThreshold.trustLevel}, 觉醒值 ${summaryThreshold.awakeningLevel}\n\n`
  }
  
  info += `游戏结束阈值: 信任度 ${GAME_ENDING_THRESHOLD.trustLevel}, 觉醒值 ${GAME_ENDING_THRESHOLD.awakeningLevel}\n`
  
  return info
} 