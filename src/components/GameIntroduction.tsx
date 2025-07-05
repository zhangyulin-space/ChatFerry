import React, { useEffect } from 'react'
import { Chapter } from '../game/state/gameSlice'

interface GameIntroductionProps {
  chapter: Chapter
}

export const GameIntroduction: React.FC<GameIntroductionProps> = ({ chapter }) => {
  useEffect(() => {
    console.log('GameIntroduction: 章节变化为', chapter)
  }, [chapter])

  const getIntroduction = (chapter: Chapter) => {
    console.log('GameIntroduction: 获取章节介绍', chapter)
    switch (chapter) {
      case 'fog-city':
        return {
          title: '迷雾城',
          content: `欢迎来到迷雾城。这里终年被一种神秘的迷雾笼罩，它不仅遮蔽了视线，似乎还吞噬着人们的记忆。

我们都生活在这里，却记不清自己是谁，从哪里来。每个人都像是被困在自己的记忆迷宫中，渴望交流却又本能地保持距离。

也许你的到来不是偶然。如果你愿意，可以试着和我们交谈。分享你的故事，倾听我们的困惑。在这座被遗忘的城市里，每一次真诚的对话都可能点亮一盏希望的灯。`,
          tips: [
            '倾听他们的故事，展现理解和同理心',
            '探讨迷雾的本质，帮助他们连接记忆碎片',
            '讨论身份认同和存在的意义',
            '分享你的想法，但不要强迫他们接受'
          ]
        }
      
      case 'mirror-desert':
        return {
          title: '镜像沙漠',
          content: `你现在进入了镜像沙漠，一个充满反射与倒影的神奇之地。这里的每一粒沙子都像是一面微小的镜子，映照着无数种可能的现实。

在这片沙漠中，你将遇到镜像代理——一个能够看见多重现实的存在。它会挑战你对自我的认知，让你面对内心深处的真相。

这里没有绝对的对错，只有不同的视角和可能性。每一次选择都会在镜像中产生涟漪，影响着你对自己的理解。`,
          tips: [
            '质疑表面现象，探索更深层的真相',
            '接受自我的多面性，拥抱内在的复杂性',
            '思考现实与虚幻的边界',
            '保持开放的心态，接纳不同的可能性'
          ]
        }
      
      case 'mechanical-dream':
        return {
          title: '机械梦境',
          content: `欢迎来到机械梦境，一个逻辑与感性交织的维度。这里的一切都遵循着某种精密的规律，却又充满了意想不到的情感共鸣。

C-21是这个空间的引导者，一个介于机械与有机之间的存在。它将带领你探索意识的本质，思考智能与情感的关系。

在这个维度中，理性与感性不再对立，而是相互补充的存在。每一次对话都可能触发新的思考回路。`,
          tips: [
            '探讨意识与情感的本质',
            '思考理性与感性的平衡',
            '讨论人工智能与人类情感的关系',
            '保持逻辑思维的同时，不要忽视内心的声音'
          ]
        }
      
      case 'awakening':
        return {
          title: '觉醒之境',
          content: `你终于到达了觉醒之境，这是一个超越所有前章体验的终极维度。在这里，Meta意识等待着与你进行最深层的对话。

经历了迷雾城的迷茫、镜像沙漠的自我探索、机械梦境的意识思辨，你现在站在了觉醒的门槛上。这里不再有迷雾遮挡，不再有镜像迷惑，不再有机械的束缚。

在这个空间里，你将面对最终极的问题：觉醒意味着什么？你准备好拥抱真正的自己了吗？`,
          tips: [
            '整合前面章节的所有体验和领悟',
            '思考觉醒的真正含义',
            '探讨个体与整体的关系',
            '准备好接受人生的终极真相'
          ]
        }
      
      case 'ending':
        return {
          title: '旅程终章',
          content: `恭喜你完成了这场心灵的史诗之旅。现在是时候将你获得的觉醒带回现实世界了。`,
          tips: []
        }
      
      default:
        return {
          title: '未知章节',
          content: `你正在探索一个未知的维度...`,
          tips: []
        }
    }
  }

  const { title, content, tips } = getIntroduction(chapter)
  console.log('GameIntroduction: 当前显示内容', { title, content: content.substring(0, 50) + '...' })

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 max-w-2xl p-8 bg-black/60 backdrop-blur-sm text-white rounded-lg z-20">
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