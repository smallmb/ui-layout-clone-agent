# 🧬 UI Layout Clone Agent (v1.1.0)

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Type](https://img.shields.io/badge/type-AI_Agent_Skill-orange.svg)
![Architecture](https://img.shields.io/badge/architecture-Multi--Agent_Swarm-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

An enterprise-grade, full-stack product reverse engineering engine powered by LLMs.

Unlike traditional code generators, this Agent Skill operates on a **Dual-Track Architecture**, seamlessly handling both local AST/Grep static analysis and dynamic Headless Browser sniffing (Playwright + Vision Model + Network Interception) for production URLs.

## ✨ Core Capabilities

- **🌐 Dynamic Site Extraction**: Extracts semantic DOM, micro-interactions, and animations directly from compiled production URLs using a headless browser (Playwright MCP) plus a vision model.
- **📡 Data-Driven Sniffing (Network Interception)**: Intercepts XHR/Fetch requests during the extraction phase to infer API schemas and generate Mock Data structures.
- **🎨 W3C Design Tokens Export**: Reverse-engineers computed styles and exports a standard `tokens.json` directly compatible with Figma Token Studio.
- **🤖 Multi-Agent Generation**: Uses subagents to prevent context overflow on large tasks. The main agent handles layout and routing, while subagents take on 3D scenes, complex CSS charts, and interaction logic. Simple pages stay single-agent (see `references/multi-agent-swarm.md`).
- **🗺️ Multi-Page Site Mapping**: Automatically extracts site structures and navigation rules to generate interconnected multi-page applications.
- **🖼️ Image and Design Reference Cloning**: Supports screenshots and design images with explicit observation, inference, and unknown boundaries.
- **🧩 Adaptive Workflow**: Uses Simple, Standard, and Advanced modes instead of forcing multi-agent execution for every task.
- **🛡️ Protected Areas and Diff/Patch Safety**: Preserves APIs, authentication, routes, global state, and business logic by default.
- **🔌 Standard Extractors**: Includes semantic DOM, design tokens, interaction states, network schema, and site-map extractors.
- **📉 Graceful Degradation**: When Playwright MCP or a vision model is unavailable, the skill falls back to static analysis and records limitations instead of failing.

## 📂 Repository Structure

The skill follows the [Agent Skills](https://agentskills.io/specification) layout (`SKILL.md` + `scripts/` + `references/` + `schemas/`):

- `/ui-layout-clone/SKILL.md` - The core Agent Skill: a routing document (<500 lines). Install the whole `ui-layout-clone/` directory.
- `/ui-layout-clone/scripts/` - Reusable browser-side extraction scripts and their execution contract.
- `/ui-layout-clone/references/` - On-demand reference docs (one level deep from `SKILL.md`): image extraction, dynamic URL sniffing, static analysis, target analysis, execution protocol, multi-agent generation, quality gates, output templates, and the English version of the skill.
- `/ui-layout-clone/schemas/` - JSON schemas: image-evidence and visual-diff data contracts.
- `/ui-layout-clone/evals/evals.json` - Starter eval cases (trigger / no-trigger / functional) for iterating with the skill-creator plugin.
- `/examples/linear-clone` - A 6-page replica of the Linear.app website built with this skill. **Generated with zero external dependencies or images.**

## 🚀 The Linear Clone Showcase

The `/examples/linear-clone` directory demonstrates the absolute power of this Agent:
1. **Pure CSS Mock UIs**: Recreated complex Kanban boards, Gantt charts, and Code Diff panels purely using nested HTML/CSS.
2. **Unified Design System**: A perfectly synchronized CSS variable system extracted directly from the target site.
3. **Vanilla JS Interactions**: Silky smooth intersection observers, tabs, and toggles without pulling in heavy libraries.

## 🛠 How to Use

### Quick Start (10 秒上手)

1. **安装 skill**：把 `ui-layout-clone/` 整个目录复制到 `~/.claude/skills/`（个人）或项目里的 `.claude/skills/`（项目共享，目录名须为 `ui-layout-clone`），然后重启 Claude Code。Cursor / Cline 等支持 Agent Skills 的 IDE 同理。
2. **环境要求（可选但推荐）**：线上 URL 动态提取需要 [Playwright MCP](https://github.com/microsoft/playwright-mcp)；图片语义分析需要多模态模型。缺失时 skill 会自动降级并记录限制，见 `ui-layout-clone/SKILL.md` 的"环境要求与降级策略"。
3. **输入提示词**：

> "克隆 https://linear.app 的首页，用纯 HTML + CSS 实现，使用 Strategy A（完全克隆）"

4. **等待 Agent 自动执行**：视觉骨架分析 → 语义 DOM 提取 → 设计令牌反推 → 代码生成
5. **查看输出**：`.layout-clone/` 目录下会生成 `reference.md` + `tokens.json` + 完整页面代码

### 进阶用法

**嗅探 API 数据模型**：
> "Sniff https://linear.app, intercept its XHR requests, and extract the API data models for the features page."

**导出 Figma 设计令牌**：
> "Extract design tokens from https://linear.app and export as W3C tokens.json for Figma Token Studio."

**多页面站点克隆**：
> "Clone the entire https://linear.app site — all 6 pages with working navigation links between them."

**多代理协作模式**：
> "Clone https://linear.app using Multi-Agent Swarm. Main Agent handles layout, delegate 3D scenes to ThreeJS_Agent and interactions to Logic_Agent."

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

| Step | Name | Tool | Output |
|------|------|------|--------|
| A | Visual Skeleton | Playwright + VisionModel | Layout structure, component inventory |
| A.5 | Site Map Extraction | Playwright + ExecuteScript | Page list, navigation hierarchy, routes |
| B | Semantic DOM | ExecuteScript | Lightweight DOM tree (JSON) |
| C | Computed Style | ExecuteScript | Design Tokens (YAML) |
| C.2 | W3C Tokens Export | ExecuteScript | tokens.json (Figma compatible) |
| D | Interaction State | Playwright + ExecuteScript | hover/click/focus transition params |
| E | Network Interception | Playwright NetworkIntercept | API data models, Mock structures |

## 📜 License

MIT
