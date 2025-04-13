# Zensky

Zensky是一款基于浏览器的哲学思辨对话游戏，玩家将在迷雾城中探索认知、现实与自我。

## 技术栈

- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Vite

## 开发环境设置

1. 克隆仓库：
```bash
git clone [repository-url]
cd zensky
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

4. 构建生产版本：
```bash
npm run build
```

## 项目结构

```
src/
  ├── components/     # React组件
  ├── game/          # 游戏核心逻辑
  │   ├── dialog/    # 对话系统
  │   ├── character/ # 角色系统
  │   ├── save/      # 存档系统
  │   └── state/     # 状态管理
  ├── scenes/        # 游戏场景
  ├── assets/        # 静态资源
  ├── utils/         # 工具函数
  └── hooks/         # 自定义Hooks
```

## 游戏特性

- 深度的哲学思辨对话
- 动态的剧情分支
- 角色信任度系统
- 觉醒值进程
- 本地存档功能
- 流畅的动画效果

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

[MIT License](LICENSE) 