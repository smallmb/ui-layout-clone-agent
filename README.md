# 🧬 UI Layout Clone Agent (v7.0.0)

![Version](https://img.shields.io/badge/version-7.0.0-blue.svg)
![Type](https://img.shields.io/badge/type-AI_Agent_Skill-orange.svg)
![Architecture](https://img.shields.io/badge/architecture-Multi--Agent_Swarm-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

An enterprise-grade, full-stack product reverse engineering engine powered by LLMs.

Unlike traditional code generators, this Agent Skill operates on a **Dual-Track Architecture**, seamlessly handling both local AST/Grep static analysis and dynamic Headless Browser sniffing (Playwright + Vision Model + Network Interception) for production URLs.

## ✨ Core Capabilities in v7.0.0

- **🌐 Dynamic Site Extraction**: Extracts semantic DOM, micro-interactions, and animations directly from compiled production URLs using Headless Browsers.
- **📡 Data-Driven Sniffing (Network Interception)**: Intercepts XHR/Fetch requests during the extraction phase to infer API schemas and generate Mock Data structures.
- **🎨 W3C Design Tokens Export**: Reverse-engineers computed styles and exports a standard `tokens.json` directly compatible with Figma Token Studio.
- **🤖 Multi-Agent Swarm Architecture**: Uses a `DelegateTask` system to prevent context overflow. The Main Agent handles layout and routing, while SubAgents simultaneously build 3D scenes, complex CSS charts, and interaction logic.
- **🗺️ Multi-Page Site Mapping**: Automatically extracts site structures and navigation rules to generate interconnected multi-page applications.

## 📂 Repository Structure

```
ui-layout-clone-agent/
├── agent/
│   └── ui-layout-clone.md    # 核心 Agent Skill 指令文件
├── examples/
│   └── linear-clone/         # Linear.app 6 页克隆展示
│       ├── index.html
│       ├── features.html
│       ├── pricing.html
│       ├── login.html
│       ├── blog.html
│       └── changelog.html
└── README.md
```

## 🚀 The Linear Clone Showcase

The `/examples/linear-clone` directory demonstrates the absolute power of this Agent:

| 页面 | 大小 | 核心内容 |
|------|------|---------|
| `index.html` | 46KB | Hero + 5 个 Benefit Section + Grid Dot 动画 + Logos Marquee + Quotes + CTA |
| `features.html` | 68KB | 6 功能卡片 + 6 个深度双栏介绍 + Mock UI 面板 |
| `pricing.html` | 49KB | 月/年切换 + 3 定价卡 + 功能对比表 + 5 个 FAQ |
| `changelog.html` | 31KB | 7 条时间线条目 + 版本标签 + 订阅表单 |
| `blog.html` | 32KB | 精选文章 + 6 篇文章网格 + Newsletter |
| `login.html` | 31KB | 分屏布局 + 登录/注册切换 + 社交登录 |

**亮点**:
- **零外部依赖**: 纯 HTML + CSS + Vanilla JS，无任何框架或图片
- **200+ Design Token**: 从 Linear.app 实时提取的完整设计系统（颜色、字体、间距、圆角、阴影、缓动函数）
- **导航互通**: 6 个页面间导航链接完全互通，当前页高亮正确
- **响应式**: 1280/1024/768/640 四档断点降级
- **动画**: Grid 5×5 点阵波纹动画（steps 离散跳变）+ Scroll fade-in

## 🛠 How to Use

1. 将 `agent/ui-layout-clone.md` 导入你的 AI IDE / Agent 框架（Cursor、Cline、mimocode 等）
2. 触发提示词示例：

> "使用 ui-layout-clone v7.0.0，嗅探 https://linear.app，使用 Strategy C（灵感提取），拦截其网络请求获取 API Schema，并导出 W3C Design Tokens。"

> "克隆 https://linear.app 的完整首页，用 React + Tailwind CSS 实现，启用多代理协作模式。"

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Input Sniffer                      │
│         (Local Path → Phase 1)                       │
│         (URL → Dynamic Extraction Phase)             │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────┐
│  Phase 1:        │  │  Dynamic Extraction Phase     │
│  Static Analysis │  │  Step A: Visual Skeleton      │
│  (AST/Grep)      │  │  Step A.5: Site Map           │
│                  │  │  Step B: Semantic DOM          │
│  16 Sub-sections │  │  Step C: Computed Style        │
│                  │  │  Step C.2: W3C Tokens          │
│                  │  │  Step D: Interaction State     │
│                  │  │  Step E: Network Interception  │
└──────────┬───────┘  └──────────────┬───────────────┘
           │                         │
           ▼                         ▼
┌─────────────────────────────────────────────────────┐
│              reference.md + tokens.json              │
│              (Unified Extraction Output)             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│           Phase 3: Multi-Agent Swarm                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Main Agent│  │CSS_Agent │  │ThreeJS   │          │
│  │(Layout)  │──│(Styles)  │  │_Agent    │          │
│  │          │  │          │  │(3D Scene)│          │
│  │          │──│DataViz   │  │Logic     │          │
│  │          │  │_Agent    │  │_Agent    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                       │                              │
│              Merge & Review                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Phase 4: Quality Gates                  │
│  ✓ Responsive  ✓ Semantics  ✓ Accessibility         │
│  ✓ Performance ✓ Tokens     ✓ Link Integrity         │
│  ✓ Anti-Slop   ✓ Interactions ✓ Sub-component       │
└─────────────────────────────────────────────────────┘
```

## 📋 Extraction Steps

| Step | 名称 | 工具 | 输出 |
|------|------|------|------|
| A | 视觉骨架分析 | Playwright + VisionModel | 页面布局结构、组件分布 |
| A.5 | 站点地图提取 | Playwright + ExecuteScript | 页面列表、导航层级、路由关系 |
| B | 降噪与语义结构 | ExecuteScript | 轻量级 DOM 树 (JSON) |
| C | 计算样式反推 | ExecuteScript | Design Token (YAML) |
| C.2 | W3C 令牌导出 | ExecuteScript | tokens.json (Figma 兼容) |
| D | 交互状态触探 | Playwright + ExecuteScript | hover/click/focus 效果参数 |
| E | 网络拦截 | Playwright NetworkIntercept | API 数据模型、Mock 结构 |

## 📜 License

MIT

## 🙏 Acknowledgments

- Built with AI Agent orchestration principles
- Design tokens extracted from [Linear.app](https://linear.app/)
- Inspired by the W3C Design Tokens Format Community Group
