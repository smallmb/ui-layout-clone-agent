# 多智能体协作生成（Phase 3）

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：Simple/Standard/Advanced 生成模式选择与多 Agent 分工。生成阶段阅读。

## 目录

- Phase 3: 多代理协作生成架构 (Multi-Agent Swarm)
  - 3.0 生成模式选择
  - 3.1 生成前实现计划
  - 3.2 图片与设计稿生成策略
  - 3.3 核心生成顺序
  - 3.4 文件与依赖边界
  - 3.5 多 Agent 协作规则
  - Legacy strategy mapping (reference only)
  - Legacy multi-agent notes
  - 协作流程
  - 共享上下文协议
  - 多页面协调
  - 生成规范
  - 生成输出

## Phase 3: 多代理协作生成架构 (Multi-Agent Swarm)

**前置**: 读取 `.layout-clone/reference.md` 和 `.layout-clone/target.md`（以及 `.layout-clone/tokens.json`）

### 3.0 生成模式选择

根据页面复杂度选择生成模式，不默认启用多 Agent：

| 模式 | 适用场景 | 执行方式 |
|------|----------|----------|
| Simple | 单页面、静态布局、图片或设计稿克隆 | 主 Agent 顺序完成分析、生成和验证 |
| Standard | 有多个组件、基础交互和响应式要求的页面 | 主 Agent 负责整体实现，必要时调用一个专用子 Agent |
| Advanced | 多页面、复杂状态、3D、Canvas、API 或 Electron | 主 Agent 负责架构和集成，按模块并行调用子 Agent |

优先选择能够完成任务的最低复杂度模式。只有出现多个相互独立的模块、上下文规模过大，或用户明确要求协作时，才使用 `DelegateTask`。

### 3.1 生成前实现计划

在写入目标项目之前，必须创建 `.layout-clone/implementation-plan.md`，并记录：

```yaml
implementation_plan:
  mode: "simple | standard | advanced"
  strategy: "full-clone | structure-upgrade | inspiration | interaction-first | image-visual-clone"
  target_area: "目标页面或区域"
  components:
    - name: "Header"
      source: "reference | existing | new"
  files_to_create: []
  files_to_modify: []
  protected_files: []
  allowed_dependencies: []
  inferred_behavior: []
  unknowns: []
  validation_points:
    - "desktop screenshot"
    - "mobile screenshot"
```

计划必须遵守 Phase 2 的 `Replaceable Areas`、`Protected Areas` 和项目约束。计划完成后再开始生成代码，不得先修改文件再补计划。

### 3.2 图片与设计稿生成策略

当参考输入是图片、截图或设计稿时，使用 `image-visual-clone` 策略：

1. 将视觉内容拆分为区域、组件、文字层级和装饰元素
2. 将可见事实、合理推断和未知信息分别记录
3. 优先复刻布局、尺寸、颜色、间距、字体层级和响应式结构
4. 仅为可观察的控件生成基础交互；推断交互必须记录在 `inferred_behavior`
5. 不伪造真实 API、DOM 结构、字体文件或不可见状态
6. 生成后通过固定视口截图对比修正视觉差异

图片输入的信息分类格式：

```yaml
observation:
  - "可从图片直接观察到的内容"
inference:
  - "根据常见 UI 模式推断的内容"
unknown:
  - "图片无法确认的内容"
```

### 3.3 核心生成顺序

所有模式都遵循以下顺序；高级模块只能在核心页面可运行后加入：

1. 读取 `reference.md`、`target.md`、`tokens.json` 和 `implementation-plan.md`
2. 生成或映射设计变量
3. 生成页面骨架和路由入口
4. 生成共享布局与页面组件
5. 生成样式、响应式规则和基础交互
6. 接入已有状态、API 和业务逻辑
7. 按需加入动画、数据可视化、3D 或桌面端能力
8. 执行导入、类型、构建和链接检查
9. 启动项目并进行桌面端和移动端截图验证
10. 根据差异修正，记录仍未还原的内容

### 3.4 文件与依赖边界

- 只能创建或修改 `implementation-plan.md` 中列出的文件
- 默认不修改 API、认证、路由契约、全局状态和业务数据结构
- 优先复用目标项目已有组件、Hooks、工具函数和设计变量
- 不引入新依赖；确有必要时先记录原因并请求用户确认
- 子 Agent 只能修改分配给自己的文件，不得覆盖主 Agent 或其他子 Agent 的文件

### 3.5 多 Agent 协作规则

仅在 `Advanced` 模式下，或 `Standard` 模式确实需要时使用 `DelegateTask`。每个子 Agent 必须接收实现计划和共享上下文，并返回：

- 修改或创建的文件
- 使用的现有依赖
- 对其他模块的接口要求
- 未完成项和潜在冲突

主 Agent 负责最终集成、冲突解决、运行验证和视觉验收。

### Legacy strategy mapping (reference only)

旧版 A/B/C/D 策略已由 `3.0` 的 Simple / Standard / Advanced 模式取代。仅用于将历史配置映射到新模式，不得作为独立执行流程。

| 场景 | 策略 | 说明 |
|------|------|------|
| 同技术栈 + 需要完全一致的视觉 | A: 完全克隆 | 直接复刻布局和样式 |
| 同技术栈 + 想要更好的视觉 | B: 结构保留+升级 | 保留骨架，升级颜色/字体/间距/阴影 |
| 不同技术栈 或 只需要灵感 | C: 灵感提取 | 只提取核心设计元素，适配到目标 |
| 需要克隆完整功能（交互+动画+状态） | D: 交互优先克隆 | 保留参考项目的交互逻辑，适配到目标技术栈 |

如果用户没有指定策略，优先根据参考输入类型、目标项目类型和视觉一致性要求自动选择；只有不同策略会导致明显不同的工作范围时才询问用户。

### Legacy multi-agent notes

以下旧版分工内容仅保留为兼容说明；实际委派必须遵循 `3.5 多 Agent 协作规则` 和  `shared-context.json` 协议。

**Main Agent (协调者)**:
- 负责整体架构决策和页面骨架生成
- 生成共享组件（Layout、Header、Footer）
- 定义组件接口和 Props 类型
- 创建 shared-context.json 协调文件
- 使用 DelegateTask 派发子任务给 SubAgent
- 执行最终的 Merge & Review

**SubAgent 分工**:

| Agent | 职责 | 输入 | 输出 |
|-------|------|------|------|
| CSS_Agent | 复杂样式系统、关键帧动画、响应式布局 | reference.md §Design System + tokens.json | CSS 文件、样式变量、动画定义 |
| ThreeJS_Agent | 3D 场景、WebGL 渲染、自定义 Shader | reference.md §3D Scene | Three.js 组件、场景配置、GLSL 代码 |
| DataViz_Agent | 数据可视化、图表、Canvas 绑定 | reference.md §Canvas 2D + §Data Models | 图表组件、可视化渲染逻辑 |
| Logic_Agent | 交互逻辑、状态管理、API 集成 | reference.md §Interactions + §State Management | 事件处理、状态代码、数据请求 |

### 协作流程

```yaml
Phase 3.1: Main Agent 布局骨架
  1. 读取 reference.md、target.md、tokens.json
  2. 选择克隆策略 (A/B/C/D)
  3. 生成页面骨架 (header/sidebar/main/footer)
  4. 定义组件接口和 Props 类型
  5. 创建 shared-context.json (见下方格式)
  6. 生成共享布局组件

Phase 3.2: SubAgent 并行生成
  1. 使用 DelegateTask 并行启动 SubAgent
  2. 每个 SubAgent 接收 shared-context.json 内容
  3. 各自生成负责的代码模块
  4. 输出到指定路径
  5. SubAgent 完成后报告状态

Phase 3.3: Merge & Review
  1. Main Agent 收集所有 SubAgent 输出
  2. 执行导入/依赖检查
  3. 解决命名冲突和重复代码
  4. 生成最终的组件组装代码
  5. 确保所有 SubAgent 代码与设计系统兼容
  6. 执行 Phase 4 质量检查
```

### 共享上下文协议

**shared-context.json 格式**:

```json
{
  "version": "1.0.0",
  "strategy": "A",
  "targetProject": {
    "framework": "react",
    "cssSolution": "tailwind",
    "stateManagement": "zustand",
    "animationLibrary": "framer-motion",
    "typescript": true
  },
  "referenceAnalysis": {
    "path": ".layout-clone/reference.md",
    "tokensPath": ".layout-clone/tokens.json"
  },
  "components": {
    "layout": { "path": "src/components/Layout.tsx", "props": ["children"] },
    "header": { "path": "src/components/Header.tsx", "props": ["navItems", "user"] },
    "footer": { "path": "src/components/Footer.tsx", "props": ["links"] }
  },
  "sharedTokens": {
    "colors": { "primary": "var(--color-primary)" },
    "spacing": { "sm": "var(--space-sm)" }
  },
  "navigation": {
    "links": [
      { "label": "Features", "file": "features.html" },
      { "label": "Pricing", "file": "pricing.html" }
    ]
  },
  "constraints": {
    "noNewDependencies": true,
    "useExistingComponents": true
  }
}
```

### 多页面协调

**当 `site_map` 存在时**:

1. Main Agent 生成共享布局组件（Header、Footer、Layout）
2. 写入 shared-context.json 包含导航链接列表
3. 每个子页面的 SubAgent 必须读取 shared-context.json 中的导航配置
4. 所有页面的导航链接必须使用 shared-context 中定义的文件名
5. 当前页面对应的导航项必须添加 `class="active"`
6. 所有页面的 Logo 链接指向 `index.html`

### 生成规范

**布局代码**:
- 使用目标项目的样式方案（CSS Modules → 写 `.module.css`，Tailwind → 写 class）
- 间距/颜色/字体必须映射到 tokens.json 中的 Design Token
- 不硬编码魔法数字，使用变量或 token

**组件代码**:
- 遵循目标项目的组件模式（函数组件 vs class、文件结构、命名风格）
- Props 类型使用目标项目的类型系统
- 复用目标项目已有的组件（如 Button、Input）

**交互代码**:
- 事件处理遵循目标项目的模式（React 合成事件 vs Vue 原生事件）
- 表单逻辑使用目标项目的表单方案（controlled vs uncontrolled）
- 滚动/拖拽行为优先使用 CSS 方案，复杂交互使用 JS

**动画代码**:
- CSS 动画：使用目标项目的样式方案编写
- JS 动画：优先使用目标项目已有的动画库
- 无动画库时：用 CSS transition/keyframes 等效实现
- 性能要求高时：使用 transform/opacity，避免 layout 触发

**状态管理**:
- 使用目标项目已有的状态方案
- 无状态库时：用 useState/useRef 等局部状态
- 复杂状态：建议用户引入状态库（需确认）

**动态渲染**:
- 条件渲染：遵循目标框架的语法（三元运算、v-if、{#if}）
- 列表渲染：正确使用 key，优先虚拟滚动
- 异步加载：使用目标框架的方案（Suspense、defineAsyncComponent）

**响应式**:
- 至少覆盖 mobile (< 640px)、tablet (640-1024px)、desktop (> 1024px)
- 使用目标项目已有的断点值

### 生成输出

每个文件写入后，输出：
```
✓ [文件路径] - [做了什么改动]
```

