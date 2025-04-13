import React, { useEffect } from 'react'
import { GameController } from '../game/controllers/GameController'

interface SaveSlot {
  id: number
  chapter: string
  timestamp: string
  trustLevel: number
  awakeningLevel: number
  dialogPreview: string
}

interface SaveMenuProps {
  isVisible: boolean
  onClose: () => void
  mode: 'save' | 'load'
  onSave: (slotId: number) => void
  onLoad: (slotId: number) => void
}

export const SaveMenu: React.FC<SaveMenuProps> = ({
  isVisible,
  onClose,
  mode,
  onSave,
  onLoad,
}) => {
  const [slots, setSlots] = React.useState<SaveSlot[]>([])
  const [selectedSlot, setSelectedSlot] = React.useState<number | null>(null)

  useEffect(() => {
    if (isVisible) {
      const saveSlots = GameController.getSaveSlots()
      setSlots(saveSlots)
      
      // 如果是保存模式，自动选择第一个空存档位
      if (mode === 'save') {
        const emptySlotId = Array.from({ length: 5 }).findIndex((_, i) => 
          !saveSlots.find(s => s.id === i)
        )
        if (emptySlotId !== -1) {
          setSelectedSlot(emptySlotId)
        }
      } else {
        setSelectedSlot(null)
      }
    }
  }, [isVisible, mode])

  if (!isVisible) return null

  const handleSlotClick = (slotId: number) => {
    if (mode === 'save') {
      // 保存时显示确认对话框
      if (slots.find(s => s.id === slotId)) {
        if (window.confirm('确定要覆盖这个存档吗？')) {
          onSave(slotId)
        }
      } else {
        onSave(slotId)
      }
    } else {
      // 读取时检查是否有存档
      if (slots.find(s => s.id === slotId)) {
        onLoad(slotId)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[32rem] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl text-white mb-4">{mode === 'load' ? '读取存档' : '保存游戏'}</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const slot = slots.find(s => s.id === i)
            const isSelected = selectedSlot === i
            return (
              <button
                key={i}
                className={`w-full p-4 ${isSelected ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} 
                  text-white rounded flex flex-col items-start relative`}
                onClick={() => handleSlotClick(i)}
              >
                {isSelected && mode === 'save' && (
                  <div className="absolute -right-2 -top-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    推荐存档位
                  </div>
                )}
                <div className="flex justify-between w-full">
                  <span className="font-bold">存档 {i + 1}</span>
                  {slot && (
                    <span className="text-sm text-gray-300">
                      {new Date(slot.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
                {slot ? (
                  <>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm">章节: {slot.chapter}</div>
                      <div className="text-sm">信任度: {slot.trustLevel}</div>
                      <div className="text-sm">觉醒度: {slot.awakeningLevel}</div>
                      {slot.dialogPreview && (
                        <div className="mt-2 text-sm text-gray-300 italic">
                          "{slot.dialogPreview}"
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-gray-400 mt-1">空存档位</span>
                )}
              </button>
            )
          })}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  )
} 