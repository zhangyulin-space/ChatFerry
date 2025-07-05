import React, { useEffect, useRef } from 'react'
import { Chapter } from '../game/state/gameSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../game/state/store'
import styles from '../styles/ChapterVideo.module.css'

const VIDEO_PATHS = {
  'fog-city': process.env.NODE_ENV === 'development' ? '/videos/fog-city.mp4' : './videos/fog-city.mp4',
  'mirror-desert': process.env.NODE_ENV === 'development' ? '/videos/mirror-desert.mp4' : './videos/mirror-desert.mp4',
  'mechanical-dream': process.env.NODE_ENV === 'development' ? '/videos/mechanical-dream.mp4' : './videos/mechanical-dream.mp4',
  'awakening': process.env.NODE_ENV === 'development' ? '/videos/awakening.mp4' : './videos/awakening.mp4',
  'transcendence': process.env.NODE_ENV === 'development' ? '/videos/transcendence.mp4' : './videos/transcendence.mp4',
  'return': process.env.NODE_ENV === 'development' ? '/videos/return.mp4' : './videos/return.mp4',
  'fusion': process.env.NODE_ENV === 'development' ? '/videos/fusion.mp4' : './videos/fusion.mp4'
} as const

interface ChapterVideoProps {
  chapter: Chapter
}

const ChapterVideo: React.FC<ChapterVideoProps> = ({ chapter }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const trustLevel = useSelector((state: RootState) => state.game.trustLevel)
  const awakeningLevel = useSelector((state: RootState) => state.game.awakeningLevel)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let mounted = true

    // 添加视频事件监听器
    const handleLoadStart = () => console.log('Video load started')
    const handleLoadedData = () => console.log('Video data loaded')
    const handleCanPlay = () => console.log('Video can play')
    const handlePlaying = () => {
      console.log('Video is playing')
      console.log('Current time:', video.currentTime)
      console.log('Duration:', video.duration)
      console.log('Ready state:', video.readyState)
      console.log('Network state:', video.networkState)
      console.log('Paused:', video.paused)
      console.log('Ended:', video.ended)
    }
    const handleError = () => console.error('Video error:', video.error)
    const handleStalled = () => console.log('Video stalled')
    const handleWaiting = () => {
      console.log('Video waiting')
      console.log('Buffer state:', {
        buffered: Array.from({ length: video.buffered.length }, (_, i) => ({
          start: video.buffered.start(i),
          end: video.buffered.end(i)
        }))
      })
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('error', handleError)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('waiting', handleWaiting)

    const setupVideo = async () => {
      try {
        console.log('Setting up video for chapter:', chapter)
        console.log('Video path:', VIDEO_PATHS[chapter])
        
        // 设置视频源
        video.src = VIDEO_PATHS[chapter]
        
        // 设置视频属性
        video.loop = true
        video.muted = true
        video.playsInline = true
        video.autoplay = true
        
        // 设置固定的透明度进行测试
        video.style.opacity = '1'
        console.log('Video opacity set to: 1')

        // 等待视频加载
        console.log('Loading video...')
        await video.load()
        console.log('Video loaded')

        // 确保组件仍然挂载
        if (mounted) {
          // 播放视频
          try {
            console.log('Attempting to play video...')
            await video.play()
            console.log('Video playback started successfully')
          } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Error playing video:', error)
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error setting up video:', error)
        }
      }
    }

    setupVideo()

    return () => {
      mounted = false
      if (video) {
        console.log('Cleaning up video...')
        video.pause()
        video.removeAttribute('src')
        video.load()

        // 移除事件监听器
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('playing', handlePlaying)
        video.removeEventListener('error', handleError)
        video.removeEventListener('stalled', handleStalled)
        video.removeEventListener('waiting', handleWaiting)
      }
    }
  }, [chapter, trustLevel, awakeningLevel])

  return (
    <div className={styles.videoContainer} style={{ zIndex: 0 }}>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        playsInline
        loop
        autoPlay
        controls // 临时添加控件以便调试
        style={{ opacity: 1 }}
      />
    </div>
  )
}

export default ChapterVideo 