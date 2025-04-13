export async function generatePlaceholderAudio(
  frequency: number,
  duration: number,
  sampleRate: number = 44100
): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  const offlineContext = new OfflineAudioContext(2, sampleRate * duration, sampleRate)
  const offlineGain = offlineContext.createGain()
  const offlineOsc = offlineContext.createOscillator()
  
  offlineOsc.type = 'sine'
  offlineOsc.frequency.setValueAtTime(frequency, 0)
  
  offlineGain.gain.setValueAtTime(0.5, 0)
  offlineGain.gain.linearRampToValueAtTime(0, duration)
  
  offlineOsc.connect(offlineGain)
  offlineGain.connect(offlineContext.destination)
  
  offlineOsc.start()
  
  const audioBuffer = await offlineContext.startRendering()
  const wavData = audioBufferToWav(audioBuffer)
  
  return new Blob([wavData], { type: 'audio/wav' })
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2
  const buffer2 = new ArrayBuffer(44 + length)
  const view = new DataView(buffer2)
  const channels = []
  let sample
  let offset = 0
  let pos = 0
  
  // 写入WAV文件头
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + length, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numOfChan, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true)
  view.setUint16(32, numOfChan * 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, length, true)
  
  // 写入采样数据
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }
  
  while (pos < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos]))
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
      view.setInt16(44 + offset, sample, true)
      offset += 2
    }
    pos++
  }
  
  return buffer2
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
} 