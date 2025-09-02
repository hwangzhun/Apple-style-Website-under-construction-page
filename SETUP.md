# Parcel 打包设置指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

启动开发服务器，支持热重载：

```bash
npm run dev
```

开发服务器将在 `http://localhost:1234` 启动

### 3. 生产构建

构建优化后的生产版本：

```bash
npm run build
```

构建文件将输出到 `dist/` 目录

### 4. 清理构建文件

```bash
npm run clean
```

## 项目配置说明

### package.json
- 定义了项目依赖和脚本
- 使用 Parcel 2.x 作为打包工具
- 配置了浏览器兼容性

### .parcelrc
- Parcel 配置文件
- 优化了 CSS 和 JavaScript 处理
- 启用了代码压缩和优化

### .gitignore
- 忽略 node_modules、构建文件等
- 保持仓库干净

## 部署

构建完成后，将 `dist/` 目录中的所有文件上传到您的 Web 服务器即可。

## 注意事项

1. 确保所有资源文件（SVG、JSON等）都在项目根目录
2. 构建后的文件路径会自动优化
3. 支持现代浏览器的所有特性

