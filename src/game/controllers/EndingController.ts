import { store } from '../state/store'
import { DialogController } from './DialogController'
import { GameController } from './GameController'
import { CharacterController } from './CharacterController'
import { setShowEndingAnimation, setEndingType } from '../state/gameSlice'
import { AudioController } from './AudioController'
import { AchievementController } from './AchievementController'

export type EndingType = 'transcendence' | 'return' | 'fusion'

interface EndingCondition {
  trust: number
  awakening: number
}

interface EndingContent {
  title: string
  description: string
  epilogue: string
}

export class EndingController {
  private static endingConditions: Record<EndingType, EndingCondition> = {
    transcendence: {
      trust: 8,
      awakening: 8
    },
    return: {
      trust: -8,
      awakening: 8
    },
    fusion: {
      trust: 0,
      awakening: 8
    }
  }

  private static endingContent: Record<EndingType, EndingContent> = {
    transcendence: {
      title: '超越：无限意识',
      description: '你选择了超越个体意识的界限，融入更高维度的存在。',
      epilogue: `在这一刻，你感受到了前所未有的宁静与开阔。所有的界限都消融了，你成为了更广大意识网络中的一个节点。

你依然保持着独特性，但同时又与一切相连。这不是终点，而是新的开始。

在这个更高维度的存在中，你将继续探索意识的无限可能...`
    },
    return: {
      title: '回归：独立意识',
      description: '你选择了保持个体意识的完整性，带着觉醒的智慧回归。',
      epilogue: `你明白了，真正的力量不在于放弃自我，而在于在保持独立性的同时理解更大的整体。

带着在迷雾城获得的觉醒与智慧，你选择回归原初的世界。你的经历将永远改变你看待现实的方式。

这不是结束，而是带着新的视角重新开始...`
    },
    fusion: {
      title: '融合：平衡意识',
      description: '你在个体与整体之间找到了平衡点，实现了真正的融合。',
      epilogue: `你发现，不需要完全放弃个体性，也不需要固守于独立意识。在对立的选择之间，你找到了第三条道路。

这是一种动态的平衡，既保持着自我的核心，又能与更大的意识网络产生共鸣。

你的选择开创了一种新的存在方式，展现了意识进化的另一种可能...`
    }
  }

  static async checkEndingConditions(): Promise<EndingType | null> {
    const state = store.getState()
    const { trustLevel, awakeningLevel } = state.game

    if (awakeningLevel >= 8) {
      if (trustLevel >= 8) {
        return 'transcendence'
      } else if (trustLevel <= -8) {
        return 'return'
      } else {
        return 'fusion'
      }
    }

    return null
  }

  static async triggerEnding(endingType: EndingType) {
    const content = this.endingContent[endingType]
    
    // 显示结局标题
    await DialogController.displayMessage({
      speaker: 'Meta意识',
      content: `【${content.title}】\n${content.description}`,
      choices: []
    })

    // 等待动画效果
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 显示结局内容
    await DialogController.displayMessage({
      speaker: 'Meta意识',
      content: content.epilogue,
      choices: []
    })

    // 触发结局动画
    store.dispatch(setEndingType(endingType))
    store.dispatch(setShowEndingAnimation(true))

    // 解锁结局成就
    await AchievementController.unlockEndingAchievement(endingType)

    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 7000))

    // 记录结局
    await this.recordEnding(endingType)
  }

  static async startEndingTransition(endingType: EndingType): Promise<void> {
    // 设置结局类型和显示动画
    store.dispatch(setEndingType(endingType))
    store.dispatch(setShowEndingAnimation(true))

    // 播放结局音效和背景音乐
    await AudioController.playUISound('ending')
    await AudioController.playBgm(endingType)

    // 解锁结局成就
    await AchievementController.unlockEndingAchievement(endingType)
  }

  static async completeEnding(): Promise<void> {
    // 停止结局音乐
    await AudioController.stopBgm()
    
    // 重置动画状态
    store.dispatch(setShowEndingAnimation(false))
    store.dispatch(setEndingType(null))
  }

  private static async recordEnding(endingType: EndingType): Promise<void> {
    // 这里可以添加结局记录逻辑，比如保存到本地存储或发送到服务器
    console.log(`Ending recorded: ${endingType}`)
  }
} 