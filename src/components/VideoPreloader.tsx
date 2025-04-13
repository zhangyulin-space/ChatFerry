import React, { useEffect } from 'react'
import { Chapter } from '../game/state/gameSlice'

const VIDEO_PATHS = {
  'fog-city': '/videos/fog-city.mp4',
  'mirror-desert': '/videos/mirror-desert.mp4',
  'mechanical-dream': '/videos/mechanical-dream.mp4',
  'awakening': '/videos/awakening.mp4',
  'transcendence': '/videos/transcendence.mp4',
  'return': '/videos/return.mp4',
  'fusion': '/videos/fusion.mp4'
} as const

interface VideoPreloaderProps {
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

const VideoPreloader: React.FC<VideoPreloaderProps> = ({
  onProgress,
  onComplete
}) => {
  useEffect(() => {
    let loadedCount = 0
    const totalVideos = Object.keys(VIDEO_PATHS).length

    const preloadVideo = (path: string) => {
      return new Promise<void>((resolve) => {
        const video = document.createElement('video')
        video.preload = 'auto'
        
        video.onloadeddata = () => {
          loadedCount++
          onProgress?.(loadedCount / totalVideos)
          resolve()
        }

        video.onerror = () => {
          console.error(`Error loading video: ${path}`)
          loadedCount++
          onProgress?.(loadedCount / totalVideos)
          resolve()
        }

        video.src = path
      })
    }

    const preloadAllVideos = async () => {
      const videoPromises = Object.values(VIDEO_PATHS).map(preloadVideo)
      await Promise.all(videoPromises)
      onComplete?.()
    }

    preloadAllVideos()
  }, [onProgress, onComplete])

  return null
}

export default VideoPreloader 