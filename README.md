# 网站建设中页面

具有多语言支持、深色模式和流畅过渡效果的苹果风格建设中页面。

## 功能特性

- 🌍 多语言支持（6种语言）
- 🌙 深色/浅色模式切换
- 📱 响应式设计
- ✨ 流畅的动画和过渡效果
- 🎨 苹果风格设计
- ⚡ 使用 Parcel 打包器快速加载

## 支持的语言

- 🇨🇳 中文 (Chinese)
- 🇺🇸 English
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)

## 开发指南

### 环境要求

- Node.js (版本 14 或更高)
- npm 或 yarn

### 安装步骤

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

开发服务器将在 `http://localhost:1234` 启动

### 生产环境构建

```bash
npm run build
```

这将在 `dist/` 目录中创建优化后的构建文件。

### 清理构建文件

```bash
npm run clean
```

## 项目结构

```
├── index.html          # 主 HTML 文件
├── style.css           # 样式文件
├── script.js           # JavaScript 功能
├── Settings.svg        # Logo 图标
├── Loading Dots.json   # Lottie 动画数据
├── package.json        # 项目配置
├── .parcelrc          # Parcel 配置
└── README.md          # 说明文档
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT 许可证

