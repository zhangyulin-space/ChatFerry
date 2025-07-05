import { Chapter } from '../state/gameSlice'

export class AudioController {
  private static readonly AUDIO_PATHS = {
    bgm: {
      'fog-city': process.env.NODE_ENV === 'development' ? '/audio/bgm/fog-city-ambience.mp3' : './audio/bgm/fog-city-ambience.mp3',
      'mirror-desert': process.env.NODE_ENV === 'development' ? '/audio/bgm/mirror-desert-theme.mp3' : './audio/bgm/mirror-desert-theme.mp3',
      'mechanical-dream': process.env.NODE_ENV === 'development' ? '/audio/bgm/mechanical-dream.mp3' : './audio/bgm/mechanical-dream.mp3',
      'awakening': process.env.NODE_ENV === 'development' ? '/audio/bgm/awakening-theme.mp3' : './audio/bgm/awakening-theme.mp3',
      transcendence: process.env.NODE_ENV === 'development' ? '/audio/bgm/transcendence.mp3' : './audio/bgm/transcendence.mp3',
      return: process.env.NODE_ENV === 'development' ? '/audio/bgm/return.mp3' : './audio/bgm/return.mp3',
      fusion: process.env.NODE_ENV === 'development' ? '/audio/bgm/fusion.mp3' : './audio/bgm/fusion.mp3'
    },
    ui: {
      click: process.env.NODE_ENV === 'development' ? '/audio/ui/click.mp3' : './audio/ui/click.mp3',
      hover: process.env.NODE_ENV === 'development' ? '/audio/ui/hover.mp3' : './audio/ui/hover.mp3',
      start: process.env.NODE_ENV === 'development' ? '/audio/ui/start.mp3' : './audio/ui/start.mp3',
      back: process.env.NODE_ENV === 'development' ? '/audio/ui/back.mp3' : './audio/ui/back.mp3',
      select: process.env.NODE_ENV === 'development' ? '/audio/ui/select.mp3' : './audio/ui/select.mp3',
      ending: process.env.NODE_ENV === 'development' ? '/audio/ui/ending.mp3' : './audio/ui/ending.mp3'
    }
  }

  private static bgmMap: Map<string, HTMLAudioElement> = new Map()
  private static uiSoundMap: Map<string, HTMLAudioElement> = new Map()
  private static currentBgm: HTMLAudioElement | null = null
  private static volume: number = 0.5
  private static uiVolume: number = 0.3
  private static initialized: boolean = false
  private static initializationPromise: Promise<void> | null = null

  static async initialize(): Promise<void> {
    if (this.initialized) return
    if (this.initializationPromise) return this.initializationPromise

    this.initializationPromise = new Promise<void>((resolve) => {
      const initOnInteraction = async () => {
        try {
          // 初始化章节背景音乐
          for (const [id, path] of Object.entries(this.AUDIO_PATHS.bgm)) {
            try {
              const audio = new Audio()
              
              // 添加错误处理
              audio.onerror = (e) => {
                console.error(`Error loading audio ${id}:`, e)
              }

              // 添加加载处理
              audio.oncanplaythrough = () => {
                console.log(`Audio ${id} loaded successfully`)
              }

              // 设置音频属性
              audio.src = path
              audio.loop = true
              audio.preload = 'auto'
              audio.volume = this.volume

              // 尝试加载音频
              await new Promise<void>((loadResolve, loadReject) => {
                audio.oncanplaythrough = () => loadResolve()
                audio.onerror = (e) => loadReject(e)
                
                // 如果音频已经加载完成，直接解析
                if (audio.readyState >= 4) {
                  loadResolve()
                }
              }).catch(error => {
                console.warn(`Failed to preload audio ${id}:`, error)
              })

              this.bgmMap.set(id, audio)
            } catch (error) {
              console.error(`Failed to initialize audio for ${id}:`, error)
            }
          }

          // 初始化UI音效
          for (const [id, path] of Object.entries(this.AUDIO_PATHS.ui)) {
            try {
              const audio = new Audio()
              
              audio.onerror = (e) => {
                console.error(`Error loading UI sound ${id}:`, e)
              }

              audio.oncanplaythrough = () => {
                console.log(`UI sound ${id} loaded successfully`)
              }

              audio.src = path
              audio.loop = false
              audio.preload = 'auto'
              audio.volume = this.uiVolume

              await new Promise<void>((loadResolve, loadReject) => {
                audio.oncanplaythrough = () => loadResolve()
                audio.onerror = (e) => loadReject(e)
                
                if (audio.readyState >= 4) {
                  loadResolve()
                }
              }).catch(error => {
                console.warn(`Failed to preload UI sound ${id}:`, error)
              })

              this.uiSoundMap.set(id, audio)
            } catch (error) {
              console.error(`Failed to initialize UI sound for ${id}:`, error)
            }
          }
          
          // 移除事件监听器
          window.removeEventListener('click', initOnInteraction)
          window.removeEventListener('touchstart', initOnInteraction)
          window.removeEventListener('keydown', initOnInteraction)
          
          this.initialized = true
          console.log('Audio system initialized')
          resolve()
        } catch (error) {
          console.error('Failed to initialize audio system:', error)
          resolve() // 即使出错也解析 Promise，让游戏可以继续
        }
      }

      // 添加事件监听器等待用户交互
      window.addEventListener('click', initOnInteraction)
      window.addEventListener('touchstart', initOnInteraction)
      window.addEventListener('keydown', initOnInteraction)
    })

    return this.initializationPromise
  }

  static async playBgm(id: string): Promise<void> {
    try {
      await this.initialize()
      
      const newBgm = this.bgmMap.get(id)
      if (!newBgm) {
        console.error(`BGM ${id} not found`)
        return
      }

      // 如果当前有音乐在播放，先淡出
      if (this.currentBgm && !this.currentBgm.paused) {
        await this.fadeOut(this.currentBgm)
      }

      // 重置新音乐的音量并播放
      newBgm.volume = 0
      await newBgm.play().catch(error => {
        console.error(`Failed to play BGM ${id}:`, error)
        throw error
      })

      // 淡入新音乐
      await this.fadeIn(newBgm)
      
      this.currentBgm = newBgm
    } catch (error) {
      console.error('Error playing BGM:', error)
    }
  }

  static async stopBgm(): Promise<void> {
    if (this.currentBgm && !this.currentBgm.paused) {
      await this.fadeOut(this.currentBgm)
      this.currentBgm.pause()
      this.currentBgm.currentTime = 0
    }
  }

  private static async fadeIn(audio: HTMLAudioElement, duration: number = 2000): Promise<void> {
    const startVolume = 0
    const targetVolume = this.volume
    const steps = 20
    const stepDuration = duration / steps
    
    return new Promise<void>((resolve) => {
      let currentStep = 0
      
      const fadeInterval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        audio.volume = startVolume + (targetVolume - startVolume) * progress
        
        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          audio.volume = targetVolume
          resolve()
        }
      }, stepDuration)
    })
  }

  private static async fadeOut(audio: HTMLAudioElement, duration: number = 2000): Promise<void> {
    const startVolume = audio.volume
    const targetVolume = 0
    const steps = 20
    const stepDuration = duration / steps
    
    return new Promise<void>((resolve) => {
      let currentStep = 0
      
      const fadeInterval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        audio.volume = startVolume + (targetVolume - startVolume) * progress
        
        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          audio.volume = targetVolume
          resolve()
        }
      }, stepDuration)
    })
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.currentBgm) {
      this.currentBgm.volume = this.volume
    }
  }

  static getVolume(): number {
    return this.volume
  }

  static async playChapterBGM(chapter: Chapter): Promise<void> {
    const bgmId = chapter as keyof typeof this.AUDIO_PATHS.bgm
    if (bgmId in this.AUDIO_PATHS.bgm) {
      await this.playBgm(bgmId)
    } else {
      console.error(`No BGM found for chapter: ${chapter}`)
    }
  }

  static async playEndingSFX(): Promise<void> {
    await this.playUISound('ending')
  }

  static async playSelectSound(): Promise<void> {
    await this.playUISound('select')
  }

  static async playUISound(id: keyof typeof this.AUDIO_PATHS.ui): Promise<void> {
    try {
      await this.initialize()
      
      const sound = this.uiSoundMap.get(id)
      if (!sound) {
        console.error(`UI sound ${id} not found`)
        return
      }

      // Clone the audio element to allow multiple simultaneous plays
      const soundClone = sound.cloneNode() as HTMLAudioElement
      soundClone.volume = this.uiVolume
      
      // Play the cloned sound
      await soundClone.play().catch(error => {
        console.error(`Failed to play UI sound ${id}:`, error)
      })

      // Clean up the clone after it finishes playing
      soundClone.onended = () => {
        soundClone.remove()
      }
    } catch (error) {
      console.error('Error playing UI sound:', error)
    }
  }

  static setUIVolume(volume: number): void {
    this.uiVolume = Math.max(0, Math.min(1, volume))
    for (const sound of this.uiSoundMap.values()) {
      sound.volume = this.uiVolume
    }
  }

  static getUIVolume(): number {
    return this.uiVolume
  }
} 