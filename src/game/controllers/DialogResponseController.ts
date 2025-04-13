import { store } from '../state/store'
import { setDialogState, addToHistory } from '../state/dialogSlice'
import { AudioController } from './AudioController'
import { Chapter } from '../state/gameSlice'
import { GameController } from './GameController'
import { CharacterController } from './CharacterController'
import { AgentManager } from '../agents/AgentManager'
import { DialogController } from './DialogController'

// Import dialog data
import fogCityDialog from '../data/fog-city-dialog.json'
import mirrorDesertDialog from '../data/mirror-desert-dialog.json'
import mechanicalDreamDialog from '../data/mechanical-dream-dialog.json'
import awakeningDialog from '../data/awakening-dialog.json'

export class DialogResponseController {
  private static agentManager = AgentManager.getInstance()
  private static initialized = false

  private static dialogData: Record<Chapter, any> = {
    'fog-city': fogCityDialog,
    'mirror-desert': mirrorDesertDialog,
    'mechanical-dream': mechanicalDreamDialog,
    'awakening': awakeningDialog
  }

  private static currentDialog: any = null
  private static currentNode: string = ''

  static async initialize() {
    if (this.initialized) return

    const commonConfig = {
      provider: 'deepseek' as const,
      model: 'deepseek-chat',
      apiKey: 'sk-0ce67830fd284f06855c2657de68dd25'
    }

    // 注册迷雾城居民代理
    this.agentManager.registerAgent(
      'fog-city-resident',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 1000
      }
    )
    await this.agentManager.loadAgentPrompt(
      'fog-city-resident',
      '/prompts/FogCityResident-agent.md'
    )

    // 注册迷雾城控制代理
    this.agentManager.registerAgent(
      'fog-city-controller',
      {
        ...commonConfig,
        temperature: 0.2,
        maxTokens: 500
      }
    )
    await this.agentManager.loadAgentPrompt(
      'fog-city-controller',
      '/prompts/FogCityController-agent.md'
    )

    // 注册镜像沙漠代理
    this.agentManager.registerAgent(
      'mirror-desert-agent',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 1000
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mirror-desert-agent',
      '/prompts/MirrorDesertAgent.md'
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
      '/prompts/MirrorDesertController.md'
    )

    // 注册机械梦境代理
    this.agentManager.registerAgent(
      'mechanical-dream-agent',
      {
        ...commonConfig,
        temperature: 0.7,
        maxTokens: 1000
      }
    )
    await this.agentManager.loadAgentPrompt(
      'mechanical-dream-agent',
      '/prompts/MechanicalDreamAgent.md'
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
      '/prompts/MechanicalDreamController.md'
    )

    // Register awakening agent
    await this.agentManager.registerAgent('awakening-agent', {
      ...commonConfig,
      temperature: 0.7,
      maxTokens: 1000
    }, '/prompts/AwakeningAgent.md');

    // Register awakening controller
    await this.agentManager.registerAgent('awakening-controller', {
      ...commonConfig,
      temperature: 0.2,
      maxTokens: 500
    }, '/prompts/AwakeningController.md');

    this.initialized = true

    // 重置对话状态
    this.currentDialog = null
    this.currentNode = ''
  }

  static async handlePlayerMessage(message: string): Promise<void> {
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

    try {
      // 获取角色代理的回应
      const response = await this.agentManager.getAgentResponse(
        agentId,
        message,
        context
      )

      // 获取控制代理的评估
      const evaluation = await this.agentManager.getControllerEvaluation(
        controllerId,
        message,
        response.message,
        context
      )

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

        // 检查是否需要切换章节
        if (response.nextChapter) {
          await GameController.startChapter(response.nextChapter)
        }

        // 记录评估理由（可用于调试或显示给玩家）
        if (evaluation.reasoning) {
          console.log('Evaluation reasoning:', evaluation.reasoning)
        }
      }
    } catch (error) {
      console.error('Error in handlePlayerMessage:', error)
      store.dispatch(setDialogState({
        content: '对不起，我现在无法正确回应。请稍后再试。',
        isVisible: true,
        isChat: true
      }))
    }
  }

  static async startChapterDialog(chapter: Chapter) {
    this.currentDialog = this.dialogData[chapter]
    this.currentNode = 'start'
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
    const node = this.currentDialog[this.currentNode]
    if (!node) return

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
    switch (chapter) {
      case 'fog-city':
        return 'fog-city-resident'
      case 'mirror-desert':
        return 'mirror-desert-agent'
      case 'mechanical-dream':
        return 'mechanical-dream-agent'
      case 'awakening':
        return 'awakening-agent'
      default:
        throw new Error(`Unknown chapter: ${chapter}`)
    }
  }

  private static getChapterControllerId(chapter: Chapter): string {
    switch (chapter) {
      case 'fog-city':
        return 'fog-city-controller'
      case 'mirror-desert':
        return 'mirror-desert-controller'
      case 'mechanical-dream':
        return 'mechanical-dream-controller'
      case 'awakening':
        return 'awakening-controller'
      default:
        throw new Error(`Unknown chapter: ${chapter}`)
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