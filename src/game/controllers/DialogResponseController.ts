import { store } from '../state/store'
import { setDialogState, addToHistory } from '../state/dialogSlice'
import { setGameStatus, setCurrentChapter, Chapter } from '../state/gameSlice'
import { AgentManager } from '../agents/AgentManager'
import { GameController } from './GameController'
import { CharacterController } from './CharacterController'
import { AudioController } from './AudioController'
import { checkGameEndingCondition } from '../config/gameThresholds'
import { ChapterSummaryController } from './ChapterSummaryController'

// 环境判断与路径工?
const isDev = process.env.NODE_ENV === 'development';
const getPromptPath = (filename: string) => isDev ? `/prompts/${filename}` : `./prompts/${filename}`;

// Import dialog data
import fogCityDialog from '../data/fog-city-dialog.json'
import mirrorDesertDialog from '../data/mirror-desert-dialog.json'
import mechanicalDreamDialog from '../data/mechanical-dream-dialog.json'
import awakeningDialog from '../data/awakening-dialog.json'

console.log('Dialog data imported:')
console.log('fogCityDialog:', fogCityDialog)
console.log('mirrorDesertDialog:', mirrorDesertDialog)
console.log('mechanicalDreamDialog:', mechanicalDreamDialog)
console.log('awakeningDialog:', awakeningDialog)

export class DialogResponseController {
  private static agentManager = AgentManager.getInstance()
  private static initialized = false

  private static dialogData: Record<Chapter, any> = {
    'fog-city': fogCityDialog,
    'mirror-desert': mirrorDesertDialog,
    'mechanical-dream': mechanicalDreamDialog,
    'awakening': awakeningDialog,
    'ending': {} // 游戏结束时不需要对话数据
  }

  private static currentDialog: any = null
  private static currentNode: string = ''

  static async initialize() {
    console.log('DialogResponseController.initialize() 开始')
    if (this.initialized) {
      console.log('DialogResponseController 已经初始化，跳过')
      return
    }

    console.log('开始初始化对话响应控制器...')

    const commonConfig = {
      provider: 'zhizengzeng' as const,
      model: "gpt-3.5-turbo", // 使用zhizengzeng支持的模型
      //model: "glm-4-flash",
      //model: "hunyuan-t1-latest",
      apiKey: 'sk-zk21eea951e55a01ad6e68998f4b5727eea67ceb61ebd678'
    }

    




    // 注册迷雾城居民代理
    this.agentManager.registerAgent(
      'fog-city-resident',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'fog-city-resident',
      getPromptPath('FogCityResident-agent.md')
    )

    // 注册迷雾城控制代理
    this.agentManager.registerAgent(
      'fog-city-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'fog-city-controller',
      getPromptPath('FogCityController-agent.md')
    )

    // 注册镜像沙漠代理
    this.agentManager.registerAgent(
      'mirror-desert-agent',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mirror-desert-agent',
      getPromptPath('MirrorDesertAgent.md')
    )

    // 注册镜像沙漠控制代理
    this.agentManager.registerAgent(
      'mirror-desert-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 500
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mirror-desert-controller',
      getPromptPath('MirrorDesertController.md')
    )

    // 注册机械梦境代理
    this.agentManager.registerAgent(
      'mechanical-dream-agent',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 300
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mechanical-dream-agent',
      getPromptPath('MechanicalDreamAgent.md')
    )

    // 注册机械梦境控制代理
    this.agentManager.registerAgent(
      'mechanical-dream-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 500
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mechanical-dream-controller',
      getPromptPath('MechanicalDreamController.md')
    )

    // Register awakening agent
    await this.agentManager.registerAgent('awakening-agent', {
      ...commonConfig,
      temperature: 0.7,
      maxTokens: 300
    }, getPromptPath('AwakeningAgent.md'));

    // Register awakening controller
    await this.agentManager.registerAgent('awakening-controller', {
      ...commonConfig,
      temperature: 0.2,
      maxTokens: 500
    }, getPromptPath('AwakeningController.md'));

    this.initialized = true

    // 重置对话状态
    this.currentDialog = null
    this.currentNode = ''
  }

  static async handlePlayerMessage(message: string): Promise<void> {
    console.log('开始处理玩家消息:', message)
    const state = store.getState()
    const chapter = state.game.currentChapter
    const context = {
      chapter,
      currentTrust: state.game.trustLevel,
      currentAwakening: state.game.awakeningLevel,
      characterMemories: state.character.memories || []
    }

    // 获取当前章节的代理ID
    const agentId = this.getChapterAgentId(chapter)
    const controllerId = this.getChapterControllerId(chapter)
    
    console.log('使用代理:', agentId, '控制器:', controllerId)

    try {
      // 获取角色代理的回应
      console.log('开始调用角色代理...')
      const response = await this.agentManager.getAgentResponse(
        agentId,
        message,
        context
      )
      console.log('角色代理回应:', response)

      // 获取控制代理的评估
      console.log('开始调用控制代理...')
      const evaluation = await this.agentManager.getControllerEvaluation(
        controllerId,
        message,
        response.message,
        context
      )
      console.log('控制代理评估:', evaluation)

      // 更新对话内容
      store.dispatch(setDialogState({
        content: response.message,
        character: { name: this.getCharacterName(chapter) },
        isVisible: true,
        isChat: true
      }))

      // 如果对话有效，更新游戏状态
      if (evaluation.isRelevant) {
        await GameController.updateGameState(
          evaluation.trustChange,
          evaluation.awakeningChange
        )

        // 如果有记忆需要添加
        if (response.memory) {
          await CharacterController.addMemory(response.memory)
        }

        // 检查是否需要切换章节或结束游戏
        if (response.nextChapter) {
          // 验证章节名有效性
          const validChapters: Chapter[] = ['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening', 'ending']
          const nextChapter = response.nextChapter as string
          
          console.log('Agent返回的nextChapter:', nextChapter)
          
          // 特殊处理：在awakening章节中，忽略nextChapter请求，除非是ending
          if (chapter === 'awakening' && nextChapter !== 'ending') {
            console.log('在觉醒章节中，忽略章节转换请求:', nextChapter)
            // 不执行章节转换，继续正常对话
          } else if (nextChapter === 'ending') {
            console.log('Agent请求结束游戏')
            store.dispatch(setGameStatus('ended'))
            return
          } else if (validChapters.includes(nextChapter as Chapter)) {
            console.log(`Agent请求跳转到章节: ${nextChapter}`)
            
            // 获取当前状态
            const currentState = store.getState()
            const currentChapter = currentState.game.currentChapter
            const trustLevel = currentState.game.trustLevel
            const awakeningLevel = currentState.game.awakeningLevel
            
            // 使用新的章节转换逻辑
            await GameController.performChapterTransitionWithSummary(
              currentChapter, 
              nextChapter as Chapter, 
              trustLevel, 
              awakeningLevel
            )
          } else {
            console.error(`Agent返回了无效的章节名: ${nextChapter}，忽略此请求`)
          }
        }

        // 检查游戏结束条件 - 使用统一配置系统
        const currentState = store.getState()
        if (checkGameEndingCondition(
          currentState.game.currentChapter,
          currentState.game.trustLevel,
          currentState.game.awakeningLevel
        )) {
          console.log('游戏结束条件满足，触发结束')
          store.dispatch(setGameStatus('ended'))
          return
        }

        // 记录评估理由（可用于调试或显示给玩家）
        if (evaluation.reasoning) {
          console.log('Evaluation reasoning:', evaluation.reasoning)
        }
      }
      console.log('消息处理完成')
    } catch (error) {
      console.error('Error in handlePlayerMessage:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      store.dispatch(setDialogState({
        content: '对不起，我现在无法正确回应。请稍后再试。错误信息: ' + (error instanceof Error ? error.message : '未知错误'),
        isVisible: true,
        isChat: true
      }))
    }
  }

  static async startChapterDialog(chapter: Chapter) {
    console.log('startChapterDialog - chapter:', chapter)
    console.log('startChapterDialog - dialogData:', this.dialogData)
    
    this.currentDialog = this.dialogData[chapter]
    console.log('startChapterDialog - currentDialog set to:', this.currentDialog)
    
    if (!this.currentDialog) {
      console.error(`No dialog data found for chapter: ${chapter}`)
      return
    }
    
    this.currentNode = 'start'
    console.log('startChapterDialog - currentNode set to:', this.currentNode)
    
    await this.showCurrentNode()
  }

  static async handleResponse(chapter: Chapter, choiceId: string) {
    if (!this.currentDialog) {
      this.currentDialog = this.dialogData[chapter]
    }

    const nextNode = this.currentDialog[this.currentNode]?.choices?.[choiceId]?.next
    if (nextNode) {
      this.currentNode = nextNode
      await this.showCurrentNode()
    }

  }

  private static async showCurrentNode() {
    console.log('showCurrentNode - currentDialog:', this.currentDialog)
    console.log('showCurrentNode - currentNode:', this.currentNode)
    
    if (!this.currentDialog) {
      console.error('currentDialog is null or undefined')
      return
    }
    
    const node = this.currentDialog[this.currentNode]
    console.log('showCurrentNode - node:', node)
    
    if (!node) {
      console.error(`Node '${this.currentNode}' not found in currentDialog`)
      return
    }

    // 显示对话内容
    store.dispatch(setDialogState({
      content: node.content,
      character: node.character ? {
        name: node.character.name,
        image: node.character.image
      } : undefined,
      choices: node.choices ? Object.entries(node.choices).map(([id, choice]: [string, any]) => ({
        id,
        text: choice.text
      })) : undefined,
      isVisible: true,
      isChat: false
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content: node.content,
      character: node.character ? {
        name: node.character.name,
        image: node.character.image
      } : undefined
    }))

    // 播放对话音效
    AudioController.playUISound('select')
  }

  private static getChapterAgentId(chapter: Chapter): string {
    console.log('getChapterAgentId called with:', chapter)
    
    // 防御性代码：如果章节名无效，强制回到迷雾城
    if (!['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening', 'ending'].includes(chapter)) {
      console.error(`Invalid chapter: ${chapter}, fallback to fog-city`)
      store.dispatch(setCurrentChapter('fog-city'))
      return 'fog-city-resident'
    }
    
    switch (chapter) {
      case 'fog-city':
        return 'fog-city-resident'
      case 'mirror-desert':
        return 'mirror-desert-agent'
      case 'mechanical-dream':
        return 'mechanical-dream-agent'
      case 'awakening':
        return 'awakening-agent'
      case 'ending':
        return 'awakening-agent' // 游戏结束时使用觉醒代理
      default:
        console.error(`Unknown chapter in getChapterAgentId: ${chapter}`)
        return 'fog-city-resident'
    }
  }

  private static getChapterControllerId(chapter: Chapter): string {
    console.log('getChapterControllerId called with:', chapter)
    
    // 防御性代码：如果章节名无效，强制回到迷雾城
    if (!['fog-city', 'mirror-desert', 'mechanical-dream', 'awakening', 'ending'].includes(chapter)) {
      console.error(`Invalid chapter: ${chapter}, fallback to fog-city`)
      store.dispatch(setCurrentChapter('fog-city'))
      return 'fog-city-controller'
    }
    
    switch (chapter) {
      case 'fog-city':
        return 'fog-city-controller'
      case 'mirror-desert':
        return 'mirror-desert-controller'
      case 'mechanical-dream':
        return 'mechanical-dream-controller'
      case 'awakening':
        return 'awakening-controller'
      case 'ending':
        return 'awakening-controller' // 游戏结束时使用觉醒控制器
      default:
        console.error(`Unknown chapter in getChapterControllerId: ${chapter}`)
        return 'fog-city-controller'
    }
  }

  private static getCharacterName(chapter: Chapter): string {
    switch (chapter) {
      case 'fog-city':
        return '孤独的居民'
      case 'mirror-desert':
        return '镜像代理'
      case 'mechanical-dream':
        return 'C-21'
      case 'awakening':
        return 'Meta意识'
      default:
        return 'Unknown'
    }
  }
} 
