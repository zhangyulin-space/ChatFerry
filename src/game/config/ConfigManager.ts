import { validateConfiguration, getConfigurationInfo } from './gameThresholds'

/**
 * 游戏配置管理器
 * 负责初始化、验证和管理所有游戏配置
 */
export class ConfigManager {
  private static initialized = false

  /**
   * 初始化游戏配置
   * 验证所有配置的有效性并输出配置信息
   */
  static initialize(): void {
    if (this.initialized) {
      console.log('配置管理器已经初始化')
      return
    }

    console.log('初始化游戏配置管理器...')

    try {
      // 验证阈值配置
      validateConfiguration()
      
      // 输出配置信息
      console.log(getConfigurationInfo())
      
      this.initialized = true
      console.log('游戏配置管理器初始化完成')
    } catch (error) {
      console.error('配置管理器初始化失败:', error)
      throw error
    }
  }

  /**
   * 检查配置是否已初始化
   */
  static isInitialized(): boolean {
    return this.initialized
  }

  /**
   * 重新加载配置
   * 用于运行时配置更新
   */
  static reload(): void {
    console.log('重新加载游戏配置...')
    this.initialized = false
    this.initialize()
  }

  /**
   * 获取配置状态信息
   */
  static getStatus(): { initialized: boolean; timestamp: string } {
    return {
      initialized: this.initialized,
      timestamp: new Date().toISOString()
    }
  }
} 