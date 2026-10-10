---
name: ui-layout-clone
description: 从参考来源反向提取界面并生成代码：解析本地源码、线上网站或图片/设计稿的布局结构、设计系统（颜色/字体/间距/动效）、交互行为与数据模型，适配目标项目的技术栈生成前端代码。
when_to_use: 当用户要求克隆/复刻网站或页面的布局、参考设计稿或线上站点生成界面、提取站点的设计令牌（design tokens）、分析网站布局与导航结构、进行多页面站点克隆时使用。参考输入可以是线上 URL、本地项目路径或图片/设计稿。
argument-hint: "[url-or-path]"
compatibility: 线上 URL 动态提取需要 Playwright MCP 服务；图片视觉分析需要多模态模型。缺失时按本文档降级策略执行，不中断核心流程。
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - WebFetch
  - Task
  - AskUserQuestion
license: MIT
metadata:
  version: "1.1.0"
---

# UI Layout Clone

从参考项目提取完整的界面行为（布局 + 交互 + 动画 + 状态），适配用户技术栈生成高质量代码。

本 SKILL.md 是路由文档：只包含流程骨架、约束与分发规则。**一次只读路由指向的参考文档，不要预读全部 references/**。

## 路由：先判断参考输入类型

**在执行任何步骤之前，必须先判断用户输入的参考来源类型。**

| 输入特征 | 类型判定 | 阅读文档 |
|----------|----------|----------|
| 本地路径（目录，或 `.html`/`.vue`/`.tsx` 等源码文件） | 本地源码项目 | `references/static-analysis.md`（Phase 1） |
| `http://` 或 `https://` 开头的 URL | 线上站点 | `references/dynamic-extraction.md` |
| 以 `localhost` 或 `127.0.0.1` 开头的 URL | 本地开发服务器 | `references/dynamic-extraction.md` |
| 图片文件（PNG、JPG、JPEG、WEBP、GIF、SVG）或截图 | 图片/设计稿 | `references/image-extraction.md` |
| 无法判定 | 询问用户 | 使用 `AskUserQuestion` 确认来源类型 |

判定为本地路径时，执行 Phase 1 静态分析流程；判定为线上 URL 时，跳过 Phase 1，进入动态嗅探流程。提取结果统一写入 `.layout-clone/reference.md`，后续与 Phase 2、Phase 3 无缝对接。

## 核心流程（默认启用）

适用于大多数 UI 复刻任务：

1. 判断参考输入类型（见上表路由）
2. 分析参考内容的布局、视觉层级、设计系统和响应式特征
3. 分析目标项目的技术栈、目录结构、依赖和现有设计系统（`references/target-analysis.md`）
4. 将参考结果和目标约束分别写入 `.layout-clone/reference.md` 与 `.layout-clone/target.md`
5. 生成前先写 `.layout-clone/implementation-plan.md`，再生成布局、组件、样式和基础交互
6. 启动目标项目并进行固定视口截图验证
7. 根据视觉和功能差异进行修正，并记录无法还原的部分

## 按需启用模块

仅在用户明确要求，或分析结果检测到相关能力时启用：

- 动画与滚动动画
- API 与数据模型
- 多页面与站点地图
- Canvas 2D 与音频可视化
- Three.js、WebGL 与 Shader
- 拖拽、触摸和手势
- Electron 桌面端能力
- 多智能体协作（`references/multi-agent-swarm.md`，按复杂度选 Simple/Standard/Advanced，不默认启用）

## 执行约束

- 参考项目的分析结果必须写入 `.layout-clone/reference.md`，作为生成阶段的输入
- 目标项目分析结果写入 `.layout-clone/target.md`
- 每次生成前必须先读取这两个文件，确保一致性
- 生成代码时必须使用目标项目的现有依赖，不引入新包
- 交互/动画/状态代码必须使用目标项目现有方案（除非目标项目没有且用户确认）
- 生成的 JS 代码必须遵循目标项目的代码风格

## 环境要求与降级策略

线上 URL 动态提取需要 Playwright MCP 服务，图片语义分析需要多模态模型。执行前检查能力是否可用，按下表降级：

| 缺失能力 | 降级方式 |
|----------|----------|
| 视觉模型 | 用截图尺寸、DOM、computed style 与可见信息分析；图片走"视觉复刻"模式并标注推断项 |
| 浏览器自动化（Playwright MCP） | 改用 WebFetch 获取静态资源分析，或请用户提供源码/截图 |
| 网络请求拦截 | 只分析公开脚本与页面可见数据，不推断完整 API Schema |
| 子 Agent 并行（Task 工具） | 主 Agent 按实现计划顺序完成各模块 |
| 像素级截图对比 | 固定视口截图 + DOM 尺寸/computed style 手动对照 |

降级后仍需完成核心流程，并在 `reference.md`、`validation.md` 或最终报告中记录缺失工具和由此产生的限制。**工具不可用不是跳过分析或声称已验证的理由。**

认证边界：需要登录的页面，优先复用用户已登录的浏览器会话，或由用户在浏览器中完成辅助登录。不得向用户索取、保存或复制密码、Cookie、Token。无法取得认证状态时继续分析公开页面，并将受保护内容标记为未验证。

## 参考文档（按需阅读，均为一级引用）

| 文档 | 内容 | 何时读 |
|------|------|--------|
| `references/image-extraction.md` | 图片/设计稿视觉复刻流程、Image Evidence 数据契约 | 图片输入时 |
| `references/dynamic-extraction.md` | 线上 URL 动态嗅探：视觉骨架 → 语义 DOM → 设计令牌 → 交互状态 → 网络拦截 | URL 输入时 |
| `references/static-analysis.md` | 本地源码 AST/Grep 静态分析（Phase 1） | 本地源码输入时 |
| `references/target-analysis.md` | 目标项目技术栈/设计系统/约束分析（Phase 2） | 生成代码前 |
| `references/execution-protocol.md` | Extractor 规范、Advanced 共享上下文协议、Diff/Patch 安全修改机制 | 生成代码前 |
| `references/multi-agent-swarm.md` | Simple/Standard/Advanced 生成模式与多 Agent 分工（Phase 3） | 生成阶段 |
| `references/quality-gates.md` | 质量门禁、视觉验证、错误处理、跨 skill 协作边界（Phase 4） | 验证阶段 |
| `references/templates.md` | `reference.md` / `target.md` 输出格式模板 | 写中间产物时 |
| `references/ui-layout-clone.en.md` | 本 skill 的英文版指令 | 需要英文指令时 |

## 脚本

`${CLAUDE_SKILL_DIR}/scripts/` 下的浏览器注入脚本是标准提取实现；各参考文档中的内联脚本仅作算法说明与降级参考，脚本可用时不得重复编写。

| 脚本 | 用途 | 输出 |
|------|------|------|
| `scripts/semantic-dom.js` | 语义 DOM 树（过滤无意义 wrapper，支持 Shadow DOM/同源 iframe） | `semantic_tree` |
| `scripts/design-tokens.js` | computed style、CSS 变量、主题线索 | `tokens.json`（W3C，兼容 Figma Token Studio） |
| `scripts/interactive-states.js` | 静态交互线索（hover/focus/ARIA/transition），不主动触发动作 | `interactions` |
| `scripts/network-schema.js` | 对宿主采集的 JSON 响应做脱敏与 Schema 推断 | `data_models` |
| `scripts/site-map.js` | 内部页面与导航关系 | `site_map` |
| `scripts/extract-image-evidence.js` | 图片基础证据（格式/尺寸/工具链状态，可选 OCR/颜色/区域适配器） | `image-evidence.json` |

统一返回 `{extractor, status, data, limitations}`；提取失败返回部分结果 + `limitations`，不得伪造完整结果。不得读取或输出密码、Cookie、Token、Authorization Header。

数据契约：`schemas/image-evidence.schema.json`（图片证据）、`schemas/visual-diff.schema.json`（视觉 diff）。

## 输出约定

- `.layout-clone/reference.md` —— 参考分析（静态/动态/图片三种提取的统一输出）
- `.layout-clone/target.md` —— 目标项目分析
- `.layout-clone/tokens.json` —— W3C Design Tokens
- `.layout-clone/implementation-plan.md` —— 生成前必须先写实现计划
- `.layout-clone/image-evidence.json` —— 图片模式的证据文件（遵循 `schemas/image-evidence.schema.json`）
- `.layout-clone/shared-context.json` —— 仅 Advanced 模式创建（见 `references/execution-protocol.md`）

## 证据纪律（反幻觉）

- 只写可观察的事实；推断必须标注并保留置信度；无法确认的记入 `unknown`。
- 图片分析不得伪造不可观察的信息（DOM 结构、事件逻辑、真实字体文件、API 数据）。
- OCR 像素高度不等于 CSS `font-size`；颜色采样不单独决定语义；边缘检测不单独决定组件类型——这些一律进 `inferred`。
- 所有限制写入 `limitations`，不得用虚构信息补全。
