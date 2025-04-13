import React from 'react'
import { Chapter } from '../game/state/gameSlice'

interface GameIntroductionProps {
  chapter: Chapter
}

export const GameIntroduction: React.FC<GameIntroductionProps> = ({ chapter }) => {
  const getIntroduction = (chapter: Chapter) => {
    switch (chapter) {
      case 'fog-city':
        return {
          title: '孤独的居民',
          content: `欢迎来到迷雾城。这里终年被一种神秘的迷雾笼罩，它不仅遮蔽了视线，似乎还吞噬着人们的记忆。

我们都生活在这里，却记不清自己是谁，从哪里来。每个人都像是被困在自己的记忆迷宫中，渴望交流却又本能地保持距离。

也许你的到来不是偶然。如果你愿意，可以试着和我们交谈。分享你的故事，倾听我们的困惑。在这座被遗忘的城市里，每一次真诚的对话都可能点亮一盏希望的灯。

你可以询问关于迷雾的事，或是分享你对这座城市的感受。记住，在这里，理解和同理心比答案更重要。`,
          tips: [
            '倾听他们的故事，展现理解和同理心',
            '探讨迷雾的本质，帮助他们连接记忆碎片',
            '讨论身份认同和存在的意义',
            '分享你的想法，但不要强迫他们接受'
          ]
        }
      // 其他章节的介绍可以后续添加
      default:
        return {
          title: '',
          content: '',
          tips: []
        }
    }
  }

  const { title, content, tips } = getIntroduction(chapter)

  return (
    <div className="fixed left-0 bottom-0 w-1/3 p-6 bg-black/40 backdrop-blur-sm text-white min-h-[200px] z-10">
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <div className="space-y-4">
        <div className="text-sm leading-relaxed whitespace-pre-line opacity-80">
          {content}
        </div>
        {tips.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-primary">背景提示</h3>
            <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameIntroduction 