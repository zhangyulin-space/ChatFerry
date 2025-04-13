import { store } from '../state/store'
import { EndingType } from './EndingController'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
}

export class AchievementController {
  private static readonly STORAGE_KEY = 'zensky_achievements'
  
  private static readonly ACHIEVEMENTS: Record<string, Omit<Achievement, 'unlockedAt'>> = {
    // 结局成就
    ending_transcendence: {
      id: 'ending_transcendence',
      title: '超越者',
      description: '抵达意识的至高点，成为无限的一部分',
      icon: '✨'
    },
    ending_return: {
      id: 'ending_return',
      title: '觉醒者',
      description: '在独立中找到真知，带着觉醒回归现实',
      icon: '🌟'
    },
    ending_fusion: {
      id: 'ending_fusion',
      title: '平衡者',
      description: '在对立中寻得和谐，实现个体与集体的平衡',
      icon: '☯️'
    },
    // 章节成就
    chapter_fog_city: {
      id: 'chapter_fog_city',
      title: '迷雾探索者',
      description: '完成迷雾城章节，开始质疑现实',
      icon: '🌫️'
    },
    chapter_mirror_desert: {
      id: 'chapter_mirror_desert',
      title: '镜像理解者',
      description: '完成镜像沙漠章节，认识多重可能',
      icon: '🪞'
    },
    chapter_mechanical_dream: {
      id: 'chapter_mechanical_dream',
      title: '机械思考者',
      description: '完成机械梦境章节，理解意识本质',
      icon: '⚙️'
    },
    // 特殊成就
    max_trust: {
      id: 'max_trust',
      title: '完全信任',
      description: '达到最高信任度',
      icon: '❤️'
    },
    max_awakening: {
      id: 'max_awakening',
      title: '完全觉醒',
      description: '达到最高觉醒值',
      icon: '🧠'
    }
  }

  static initialize(): void {
    // 从本地存储加载成就数据
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    if (!savedData) {
      // 初始化成就数据
      const initialData = Object.values(this.ACHIEVEMENTS).map(achievement => ({
        ...achievement,
        unlockedAt: null
      }))
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData))
    }
  }

  static async unlockAchievement(achievementId: string): Promise<boolean> {
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    if (!savedData) return false

    const achievements: Achievement[] = JSON.parse(savedData)
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (!achievement || achievement.unlockedAt !== null) {
      return false
    }

    // 更新成就解锁时间
    achievement.unlockedAt = Date.now()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(achievements))

    // 显示成就解锁通知
    this.showAchievementNotification(achievement)

    return true
  }

  static async unlockEndingAchievement(endingType: EndingType): Promise<void> {
    const achievementId = `ending_${endingType}`
    await this.unlockAchievement(achievementId)
  }

  static async unlockChapterAchievement(chapter: string): Promise<void> {
    const achievementId = `chapter_${chapter}`
    await this.unlockAchievement(achievementId)
  }

  static getAchievements(): Achievement[] {
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : []
  }

  static getUnlockedAchievements(): Achievement[] {
    return this.getAchievements().filter(a => a.unlockedAt !== null)
  }

  static isAchievementUnlocked(achievementId: string): boolean {
    const achievements = this.getAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    return achievement?.unlockedAt !== null
  }

  private static showAchievementNotification(achievement: Achievement): void {
    // 创建通知元素
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-slate-800 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 transform translate-x-full transition-transform duration-500'
    notification.innerHTML = `
      <span class="text-2xl">${achievement.icon}</span>
      <div>
        <h3 class="font-bold">${achievement.title}</h3>
        <p class="text-sm text-slate-300">${achievement.description}</p>
      </div>
    `

    // 添加到页面
    document.body.appendChild(notification)

    // 显示动画
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)

    // 3秒后移除
    setTimeout(() => {
      notification.style.transform = 'translateX(full)'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 3000)
  }
} 