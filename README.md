# 瞬译 FlashTrans

基于 [uTools](https://u.tools) 的 AI 翻译插件，调用智谱 GLM-4-Flash-250414 大模型提供高质量翻译。

## 功能特性

- **AI 翻译**：基于智谱 GLM-4-Flash-250414 模型，支持多种语言互译 
- **实时翻译**：开启实时翻译后，输入文本后 800ms 自动翻译，无需手动点击
- **流式输出**：翻译结果逐字流式显示，体验流畅
- **快捷键**：Enter 触发翻译，Shift+Enter 为换行
- **粘贴翻译**：一键读取剪贴板内容并翻译
- **本地存储**：API Key 安全保存在本地 localStorage

## 项目结构

```
FlashTrans/
├── src/
│   ├── index.html    # 主页面 HTML
│   ├── styles.css    # 样式表
│   ├── preload.js    # Node.js 预加载脚本（API 调用）
│   ├── plugin.json   # uTools 插件配置
│   └── logo.png      # 插件图标
└── README.md
```

## 快速开始

### 1. 获取 API Key

前往 [智谱 BigModel 开放平台](https://open.bigmodel.cn/) 注册并获取 API Key。

> GLM-4-Flash-250414 为免费模型

### 2. 安装插件

- 在 uTools 插件市场搜索「瞬译」安装
- 或使用 uTools 开发者工具将 `src/plugin.json` 接入本地开发

## 协议

[MIT License](LICENSE)

## 作者

大沄 · [B站主页](https://space.bilibili.com/192702710)