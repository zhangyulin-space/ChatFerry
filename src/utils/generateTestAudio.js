import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 生成WAV文件头
function createWavHeader(dataLength, sampleRate = 44100, channels = 1, bitsPerSample = 16) {
  const buffer = Buffer.alloc(44)
  
  // RIFF chunk descriptor
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataLength, 4)
  buffer.write('WAVE', 8)
  
  // fmt sub-chunk
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16) // Subchunk1Size
  buffer.writeUInt16LE(1, 20) // AudioFormat (PCM)
  buffer.writeUInt16LE(channels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28) // ByteRate
  buffer.writeUInt16LE(channels * bitsPerSample / 8, 32) // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34)
  
  // data sub-chunk
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataLength, 40)
  
  return buffer
}

// 生成正弦波数据
function generateSineWave(frequency, duration, sampleRate = 44100) {
  const samples = Math.floor(sampleRate * duration)
  const data = new Int16Array(samples)
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate
    data[i] = Math.floor(32767 * Math.sin(2 * Math.PI * frequency * t))
  }
  
  return data
}

// 生成章节音频
async function generateChapterAudio() {
  const projectRoot = path.resolve(__dirname, '..', '..')
  const audioDir = path.join(projectRoot, 'public', 'audio', 'bgm')
  
  // 确保音频目录存在
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
  }
  
  // 为每个章节生成音频
  const chapters = [
    { name: 'fog-city', frequency: 220, duration: 10 }, // A3
    { name: 'mirror-desert', frequency: 277.18, duration: 10 }, // C#4
    { name: 'mechanical-dream', frequency: 329.63, duration: 10 }, // E4
    { name: 'awakening', frequency: 440, duration: 10 }, // A4
    { name: 'transcendence', frequency: 554.37, duration: 10 }, // C#5
    { name: 'return', frequency: 659.25, duration: 10 }, // E5
    { name: 'fusion', frequency: 880, duration: 10 } // A5
  ]
  
  for (const chapter of chapters) {
    const { name, frequency, duration } = chapter
    const sampleRate = 44100
    const data = generateSineWave(frequency, duration, sampleRate)
    const header = createWavHeader(data.byteLength, sampleRate)
    
    const filePath = path.join(audioDir, `${name}.wav`)
    const fileHandle = fs.openSync(filePath, 'w')
    
    fs.writeSync(fileHandle, header)
    fs.writeSync(fileHandle, Buffer.from(data.buffer))
    fs.closeSync(fileHandle)
    
    console.log(`Generated ${name}.wav`)
  }
}

// 如果直接运行此文件，则生成音频
if (import.meta.url === `file://${process.argv[1]}`) {
  generateChapterAudio().catch(console.error)
}

export { generateChapterAudio } 