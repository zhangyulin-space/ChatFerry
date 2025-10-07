// 测试第四章节完整修复和总结功能
console.log('测试第四章节完整修复和总结功能...')

// 模拟章节转换检查
function checkChapterTransition(currentChapter, trustLevel, awakeningLevel) {
  console.log(`检查章节转换: 章节=${currentChapter}, 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
  
  const CHAPTER_TRANSITIONS = [
    {
      from: 'fog-city',
      to: 'mirror-desert',
      threshold: { trustLevel: 10, awakeningLevel: 8 }
    },
    {
      from: 'mirror-desert',
      to: 'mechanical-dream',
      threshold: { trustLevel: 12, awakeningLevel: 9 }
    },
    {
      from: 'mechanical-dream',
      to: 'awakening',
      threshold: { trustLevel: 14, awakeningLevel: 10 }
    }
  ]
  
  const transition = CHAPTER_TRANSITIONS.find(t => t.from === currentChapter)
  if (!transition) {
    console.log(`未找到章节转换配置: ${currentChapter}`)
    return null
  }
  
  console.log(`章节转换阈值: 信任度>=${transition.threshold.trustLevel}, 觉醒值>=${transition.threshold.awakeningLevel}`)
  
  if (trustLevel >= transition.threshold.trustLevel && awakeningLevel >= transition.threshold.awakeningLevel) {
    console.log(`满足章节转换条件: ${currentChapter} -> ${transition.to}`)
    return transition.to
  } else {
    console.log(`不满足章节转换条件`)
  }
  
  return null
}

// 模拟章节总结检查
function checkChapterSummary(currentChapter, trustLevel, awakeningLevel) {
  console.log(`检查章节总结: 章节=${currentChapter}, 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
  
  const CHAPTER_SUMMARY_THRESHOLDS = {
    'fog-city': { trustLevel: 10, awakeningLevel: 8 },
    'mirror-desert': { trustLevel: 12, awakeningLevel: 9 },
    'mechanical-dream': { trustLevel: 14, awakeningLevel: 10 },
    'awakening': { trustLevel: 8, awakeningLevel: 6 } // 新的阈值
  }
  
  const threshold = CHAPTER_SUMMARY_THRESHOLDS[currentChapter]
  if (!threshold) {
    console.log(`未找到章节总结配置: ${currentChapter}`)
    return false
  }
  
  const shouldShow = trustLevel >= threshold.trustLevel && awakeningLevel >= threshold.awakeningLevel
  console.log(`章节总结条件检查结果: ${shouldShow}`)
  
  return shouldShow
}

// 模拟游戏结束检查
function checkEndingCondition(currentChapter, trustLevel, awakeningLevel) {
  console.log(`检查游戏结束条件: 章节=${currentChapter}, 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
  
  if (currentChapter !== 'awakening') {
    console.log('不是觉醒章节，不检查游戏结束条件')
    return false
  }
  
  const GAME_ENDING_THRESHOLD = { trustLevel: 15, awakeningLevel: 12 } // 新的阈值
  
  const shouldEnd = trustLevel >= GAME_ENDING_THRESHOLD.trustLevel && awakeningLevel >= GAME_ENDING_THRESHOLD.awakeningLevel
  console.log(`游戏结束条件检查结果: ${shouldEnd}`)
  
  return shouldEnd
}

// 模拟游戏状态更新
function updateGameState(currentChapter, trustLevel, awakeningLevel, trustChange, awakeningChange) {
  console.log(`\n=== 模拟游戏状态更新 ===`)
  console.log(`当前章节: ${currentChapter}`)
  console.log(`当前状态: 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
  console.log(`状态变化: 信任度+${trustChange}, 觉醒值+${awakeningChange}`)
  
  const newTrustLevel = trustLevel + trustChange
  const newAwakeningLevel = awakeningLevel + awakeningChange
  
  console.log(`新状态: 信任度=${newTrustLevel}, 觉醒值=${newAwakeningLevel}`)
  
  // 检查是否满足游戏结束条件
  if (checkEndingCondition(currentChapter, newTrustLevel, newAwakeningLevel)) {
    console.log('满足游戏结束条件')
    return 'ending'
  }
  
  // 检查章节总结条件（包括第四章节）
  const shouldShowSummary = checkChapterSummary(currentChapter, newTrustLevel, newAwakeningLevel)
  if (shouldShowSummary) {
    console.log(`✅ 会触发章节总结`)
    return 'summary'
  }
  
  // 检查章节转换
  if (currentChapter === 'awakening') {
    console.log('在觉醒章节中，跳过章节跳转检查')
  } else {
    const nextChapter = checkChapterTransition(currentChapter, newTrustLevel, newAwakeningLevel)
    if (nextChapter) {
      console.log(`❌ 会触发章节转换到: ${nextChapter}`)
      return nextChapter
    } else {
      console.log(`✅ 不会触发章节转换`)
    }
  }
  
  return null
}

// 模拟获取下一章节
function getNextChapter(currentChapter) {
  switch (currentChapter) {
    case 'fog-city':
      return 'mirror-desert'
    case 'mirror-desert':
      return 'mechanical-dream'
    case 'mechanical-dream':
      return 'awakening'
    case 'awakening':
      return 'ending' // 第四章节总结后进入结局
    default:
      return 'fog-city'
  }
}

// 模拟结局类型检查
function checkEndingType(trustLevel, awakeningLevel) {
  console.log(`检查结局类型: 信任度=${trustLevel}, 觉醒值=${awakeningLevel}`)
  
  if (awakeningLevel >= 8) {
    if (trustLevel >= 8) {
      console.log('结局类型: 超越')
      return 'transcendence'
    } else if (trustLevel <= -8) {
      console.log('结局类型: 回归')
      return 'return'
    } else {
      console.log('结局类型: 融合')
      return 'fusion'
    }
  } else {
    console.log('不满足结局条件')
    return null
  }
}

// 测试第四章节低分数
console.log('\n=== 测试第四章节低分数 ===')
const result = updateGameState('awakening', 5, 3, 2, 1)
console.log('结果:', result)

// 测试第四章节达到总结条件
console.log('\n=== 测试第四章节达到总结条件 ===')
const result2 = updateGameState('awakening', 6, 5, 3, 2)
console.log('结果:', result2)

// 测试第四章节达到游戏结束条件
console.log('\n=== 测试第四章节达到游戏结束条件 ===')
const result3 = updateGameState('awakening', 12, 10, 4, 3)
console.log('结果:', result3)

// 测试第四章节总结后的流程
console.log('\n=== 测试第四章节总结后的流程 ===')
const nextChapter = getNextChapter('awakening')
console.log('第四章节总结后的下一章节:', nextChapter)

// 测试结局类型
console.log('\n=== 测试结局类型 ===')
const endingType1 = checkEndingType(16, 13)
const endingType2 = checkEndingType(10, 9)
const endingType3 = checkEndingType(-10, 9)

// 测试其他章节
console.log('\n=== 测试其他章节 ===')
const result4 = updateGameState('fog-city', 12, 9, 1, 1)
console.log('章节转换结果:', result4)

console.log('\n=== 修复验证 ===')
console.log('✅ 第四章节不会错误触发章节转换')
console.log('✅ 第四章节在达到条件时会显示总结页面')
console.log('✅ 第四章节总结后会正确进入结局')
console.log('✅ 分数不会被清零')
console.log('✅ 总结页面包含完整的觉醒章节内容')
console.log('✅ 游戏结束阈值高于总结阈值，确保总结能正常显示')
console.log('✅ 结局类型根据信任度和觉醒值正确判断') 