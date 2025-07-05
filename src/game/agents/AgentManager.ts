import { Chapter } from '../state/gameSlice'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

type ModelProvider = 'openai' | 'ollama' | 'anthropic' 
                   | 'gemini' | 'custom' | 'deepseek'|'openrouter'|'zhizengzeng'

type ModelName = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro' | 'mistral' 
                 | 'llama2' | 'deepseek-chat' |'qwen/qwen3-32b:free' |string

interface AgentConfig {
  provider: ModelProvider
  model: ModelName
  temperature: number
  maxTokens: number
  apiKey?: string
  baseUrl?: string
  customHeaders?: Record<string, string>
}

interface AgentResponse {
  message: string
  memory?: string
  nextChapter?: Chapter
}

interface ControllerEvaluation {
  trustChange: number
  awakeningChange: number
  isRelevant: boolean
  reason: string
}

interface LLMResponse {
  content: string
  error?: string
}

export class AgentManager {
  private static instance: AgentManager
  private agents: Map<string, AgentConfig> = new Map()
  private agentPrompts: Map<string, string> = new Map()

  private constructor() {}

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager()
    }
    return AgentManager.instance
  }

  registerAgent(agentId: string, config: AgentConfig, prompt?: string) {
    this.agents.set(agentId, config)
    if (prompt) {
      this.agentPrompts.set(agentId, prompt)
    }
  }

  private async callOpenRouter(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      console.log('Calling OpenRouter API with model:', config.model)
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: config.model,
          messages: [{ role: 'system', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/zhangyulin-space/ChatFerry', 
            'X-Title': 'ChatFerry' 
          },
          timeout: 30000 // 30秒超时
        }
      )
      console.log('OpenRouter API response received')
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('OpenRouter API error:', error)
      if (error.code === 'ECONNABORTED') {
        return { content: '', error: '请求超时，请稍后再试' }
      }
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        return { content: '', error: `API错误: ${error.response.status} - ${error.response.data?.error?.message || '未知错误'}` }
      }
      return { content: '', error: error?.message || '调用 OpenRouter API 失败' }
    }
  }


  private async callOpenAI(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: config.model,
          messages: [{ role: 'system', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('OpenAI API error:', error)
      return { content: '', error: error?.message || '调用 OpenAI API 失败' }
    }
  }

  private async callOllama(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        `${config.baseUrl || 'http://localhost:11434'}/api/generate`,
        {
          model: config.model,
          prompt: prompt,
          temperature: config.temperature,
          max_tokens: config.maxTokens
        }
      )
      return { content: response.data.response }
    } catch (error: any) {
      console.error('Ollama API error:', error)
      return { content: '', error: error?.message || '调用 Ollama API 失败' }
    }
  }

  private async callAnthropic(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      )
      return { content: response.data.content[0].text }
    } catch (error: any) {
      console.error('Anthropic API error:', error)
      return { content: '', error: error?.message || '调用 Anthropic API 失败' }
    }
  }

  private async callGemini(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/${config.model}:generateContent`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': config.apiKey
          }
        }
      )
      return { content: response.data.candidates[0].content.parts[0].text }
    } catch (error: any) {
      console.error('Gemini API error:', error)
      return { content: '', error: error?.message || '调用 Gemini API 失败' }
    }
  }

  private async callCustomModel(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        config.baseUrl!,
        { prompt, ...config },
        {
          headers: {
            'Content-Type': 'application/json',
            ...config.customHeaders
          }
        }
      )
      return { content: response.data.response }
    } catch (error: any) {
      console.error('Custom model API error:', error)
      return { content: '', error: error?.message || '调用自定义模型失败' }
    }
  }

  private async callDeepSeek(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: config.model || 'deepseek-chat',
          messages: [{ role: 'system', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('DeepSeek API error:', error)
      return { content: '', error: error?.message || '调用 DeepSeek API 失败' }
    }
  }

  private async callZhizengzeng(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    try {
      console.log('Calling Zhizengzeng API with model:', config.model)
      const response = await axios.post(
        'https://api.zhizengzeng.com/v1/chat/completions',
        {
          model: config.model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30秒超时
        }
      )
      console.log('Zhizengzeng API response received')
      return { content: response.data.choices[0].message.content }
    } catch (error: any) {
      console.error('Zhizengzeng API error:', error)
      if (error.code === 'ECONNABORTED') {
        return { content: '', error: '请求超时，请稍后再试' }
      }
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        return { content: '', error: `API错误: ${error.response.status} - ${error.response.data?.error?.message || '未知错误'}` }
      }
      return { content: '', error: error?.message || '调用 Zhizengzeng API 失败' }
    }
  }

  private async callModel(prompt: string, config: AgentConfig): Promise<LLMResponse> {
    switch (config.provider) {
      case 'deepseek':
        return this.callDeepSeek(prompt, config)
      case 'openai':
        return this.callOpenAI(prompt, config)
      case 'ollama':
        return this.callOllama(prompt, config)
      case 'anthropic':
        return this.callAnthropic(prompt, config)
      case 'gemini':
        return this.callGemini(prompt, config)
      case 'custom':
        return this.callCustomModel(prompt, config)
      
      case 'openrouter':
          return this.callOpenRouter(prompt, config)
  
      case 'zhizengzeng':
        return this.callZhizengzeng(prompt, config)
  
      default:
        throw new Error(`Unsupported model provider: ${config.provider}`)
    }
  }

  async getAgentResponse(
    agentId: string,
    message: string,
    context: {
      chapter: Chapter
      currentTrust: number
      currentAwakening: number
      characterMemories: string[]
    }
  ): Promise<AgentResponse> {
    const config = this.agents.get(agentId)
    if (!config) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const prompt = this.agentPrompts.get(agentId)
    if (!prompt) {
      throw new Error(`Prompt for agent ${agentId} not found`)
    }

    const fullPrompt = `
${prompt}

当前状态：
章节：${context.chapter}
信任度：${context.currentTrust}
觉醒值：${context.currentAwakening}
记忆：
${context.characterMemories.join('\n')}

玩家消息：
${message}

请以角色的身份回应玩家，并返回JSON格式的回应，包含以下字段：
{
  "message": string, // 角色的回应
  "memory": string, // 可选，需要记录的重要对话内容
  "nextChapter": string // 可选，是否需要切换到下一章节
}
`

    const response = await this.callModel(fullPrompt, config)
    if (response.error) {
      console.error(`Error calling ${config.provider} model:`, response.error)
      return { message: '对不起，我现在无法正确回应。请稍后再试。' }
    }

    try {
      return JSON.parse(response.content)
    } catch (error) {
      console.error('Failed to parse agent response:', error)
      return { message: response.content }
    }
  }

  async getControllerEvaluation(
    agentId: string,
    playerMessage: string,
    agentResponse: string,
    context: any
  ): Promise<{
    isRelevant: boolean
    trustChange: number
    awakeningChange: number
    reasoning?: string
  }> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const prompt = this.agentPrompts.get(agentId)
    if (!prompt) {
      throw new Error(`Prompt for agent ${agentId} not found`)
    }

    try {
      const evaluationPrompt = `${prompt}

请评估以下对话并以JSON格式返回结果：

玩家消息：
${playerMessage}

代理回应：
${agentResponse}

当前上下文：
章节：${context.chapter}
信任度：${context.currentTrust}
觉醒值：${context.currentAwakening}

请以下面的格式返回评估结果（确保是有效的JSON）：
{
  "isRelevant": true/false,
  "trustChange": number (-3 到 3),
  "awakeningChange": number (0 到 3),
  "reasoning": "评估理由"
}`

      const response = await this.callModel(evaluationPrompt, agent)
      
      try {
        const evaluation = JSON.parse(this.extractJSON(response.content))
        return {
          isRelevant: Boolean(evaluation.isRelevant),
          trustChange: Number(evaluation.trustChange) || 0,
          awakeningChange: Number(evaluation.awakeningChange) || 0,
          reasoning: String(evaluation.reasoning || '')
        }
      } catch (parseError) {
        console.error('Failed to parse evaluation response:', parseError)
        return {
          isRelevant: true,
          trustChange: 0,
          awakeningChange: 0,
          reasoning: '无法解析评估结果'
        }
      }
    } catch (error) {
      console.error('Error getting controller evaluation:', error)
      throw error
    }
  }

  // private extractJSON(text: string): string {
  //   const jsonMatch = text.match(/\{[\s\S]*\}/)
  //   if (!jsonMatch) {
  //     throw new Error('No JSON object found in response')
  //   }
  //   return jsonMatch[0]
  // }

  private extractJSON(text: string): string {
    try {
      // 首先尝试直接解析整个响应
      JSON.parse(text)
      return text
    } catch (e) {
      // 如果直接解析失败，尝试提取 JSON 对象
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          JSON.parse(jsonMatch[0])
          return jsonMatch[0]
        } catch (e) {
          console.error('Failed to parse extracted JSON:', e)
        }
      }
      
      // 如果还是失败，返回一个默认的 JSON 对象
      return JSON.stringify({
        isRelevant: true,
        trustChange: 0,
        awakeningChange: 0,
        reasoning: '无法解析评估结果，使用默认值'
      })
    }
  }


  async loadAgentPrompt(agentId: string, promptPath: string) {
    try {
      const response = await fetch(promptPath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const prompt = await response.text()
      this.agentPrompts.set(agentId, prompt)
    } catch (error: any) {
      console.error(`Failed to load prompt for agent ${agentId}:`, error)
      throw new Error(`Failed to load prompt: ${error?.message || '未知错误'}`)
    }
  }
} 