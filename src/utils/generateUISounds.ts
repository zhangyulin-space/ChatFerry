const generateUISounds = async () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  const generateSound = async (
    type: 'click' | 'hover' | 'start' | 'back' | 'select' | 'ending',
    options: {
      frequency?: number,
      duration?: number,
      type?: OscillatorType,
      volume?: number
    } = {}
  ) => {
    const {
      frequency = type === 'click' ? 800 :
                 type === 'hover' ? 600 :
                 type === 'start' ? 440 :
                 type === 'back' ? 300 :
                 type === 'select' ? 700 :
                 type === 'ending' ? 520 : 440,
      duration = type === 'click' ? 0.1 :
                type === 'hover' ? 0.05 :
                type === 'start' ? 0.3 :
                type === 'back' ? 0.15 :
                type === 'select' ? 0.15 :
                type === 'ending' ? 0.5 : 0.2,
      type: waveType = type === 'start' || type === 'ending' ? 'sine' : 'square',
      volume = type === 'hover' ? 0.2 :
              type === 'ending' ? 0.4 : 0.3
    } = options

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = waveType
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)

    // Convert to WAV
    const offlineContext = new OfflineAudioContext(1, audioContext.sampleRate * duration, audioContext.sampleRate)
    const offlineOscillator = offlineContext.createOscillator()
    const offlineGain = offlineContext.createGain()

    offlineOscillator.type = waveType
    offlineOscillator.frequency.setValueAtTime(frequency, 0)
    
    offlineGain.gain.setValueAtTime(volume, 0)
    offlineGain.gain.exponentialRampToValueAtTime(0.01, duration)

    offlineOscillator.connect(offlineGain)
    offlineGain.connect(offlineContext.destination)

    offlineOscillator.start()
    offlineOscillator.stop(duration)

    const renderedBuffer = await offlineContext.startRendering()
    
    // Convert AudioBuffer to WAV
    const numberOfChannels = renderedBuffer.numberOfChannels
    const length = renderedBuffer.length
    const sampleRate = renderedBuffer.sampleRate
    const wavBuffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(wavBuffer)

    // WAV Header
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + length * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    view.setUint16(32, numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, length * 2, true)

    // Write audio data
    const channelData = renderedBuffer.getChannelData(0)
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }

    // Create Blob and save file
    const blob = new Blob([wavBuffer], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}.mp3`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Generate UI sounds
  await generateSound('click', { frequency: 800, duration: 0.1 })
  await generateSound('hover', { frequency: 600, duration: 0.05, volume: 0.2 })
  await generateSound('start', { frequency: 440, duration: 0.3, type: 'sine' })
  await generateSound('back', { frequency: 300, duration: 0.15 })
  await generateSound('select', { frequency: 700, duration: 0.15 })
  await generateSound('ending', { frequency: 520, duration: 0.5, type: 'sine', volume: 0.4 })
}

export default generateUISounds 