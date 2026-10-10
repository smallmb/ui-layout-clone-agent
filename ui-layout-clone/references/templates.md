# 输出模板

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：reference.md（URL/源码两种模式）与 target.md 的输出格式模板。

## 目录

- reference.md（线上 URL 模式）
- Tech Stack
- Layout Structure
- Design System
- Component Patterns
- Animations
- Interactions
- Semantic Tree
- Responsive Behavior
- Site Map
- Data Models
- Design Tokens File
- reference.md（本地源码模式）
- Tech Stack
- Layout Structure
- Design System
- Component Patterns
- Animations
- Interactions
- State Management
- Dynamic Rendering
- 3D Scene (if applicable)
- Canvas 2D (if applicable)
- Advanced Animations
- Drag & Drop
- Audio Visualization (if applicable)
- Gestures (if applicable)
- Electron (if applicable)
- Data Models(新增)
- Site Map
- target.md（目标项目分析）
- Project Type
- Tech Stack
- Runtime Status
- Existing Design System
- Reusable Assets
- Existing Interactions & State
- Replaceable Areas
- Protected Areas
- Constraints

# 输出模板

> 按需参考：reference.md / target.md 的输出格式模板。

## reference.md（线上 URL 模式）

```markdown
# Reference Analysis: [站点URL或名称]

> 提取方式: Dynamic Extraction (v1.1.0)
> 提取时间: [ISO 8601]

## Tech Stack
<!-- 从页面 HTML head/meta、script src、CSS link 中推断框架和库 -->
<!-- 如: Next.js、React、Tailwind CSS、Framer Motion 等 -->

## Layout Structure
<!-- Step A 视觉骨架分析 + Step B 语义结构树 -->

## Design System
<!-- Step C computed style 提取的 Design Token -->

## Component Patterns
<!-- Step B 语义结构中提取的组件类型和层级 -->

## Animations
<!-- Step D 提取的 keyframes 和 animation 属性 -->

## Interactions
<!-- Step D hover/click/focus 状态变化和 transition 参数 -->

## Semantic Tree
<!-- Step B 完整的语义化 DOM 树（JSON） -->

## Responsive Behavior
<!-- 对比 1440px 和 375px 两个视口下的结构差异 -->

## Site Map
<!-- Step A.5 站点地图：页面列表、导航层级、路由关系 -->

## Data Models
<!-- Step E 网络拦截：API 端点、数据模型、Mock 结构 -->

## Design Tokens File
<!-- tokens.json 的 W3C Design Tokens 格式引用 -->
```

## reference.md（本地源码模式）

```markdown
# Reference Analysis: [项目名]

## Tech Stack
## Layout Structure
## Design System
## Component Patterns
## Animations
## Interactions
## State Management
## Dynamic Rendering
## 3D Scene (if applicable)
## Canvas 2D (if applicable)
## Advanced Animations
## Drag & Drop
## Audio Visualization (if applicable)
## Gestures (if applicable)
## Electron (if applicable)
## Data Models(新增)
## Site Map
```

## target.md（目标项目分析）

```markdown
# Target Analysis: [项目名]

## Project Type
- existing-project / empty-project / static-html / partial-project
- runnable: yes/no
- entry: [入口路径]

## Tech Stack
- framework:
- language:
- build-tool:
- package-manager:
- router:
- css-solution:
- component-library:
- icon-library:
- animation-library:
- state-management:
- data-fetching:

## Runtime Status
- dev-server:
- routes:
- startup-errors:
- render-status:
- reference-screenshots:

## Existing Design System
- colors:
- typography:
- spacing:
- breakpoints:
- tokens:

## Reusable Assets
- components:
- hooks:
- utilities:
- images:
- fonts:

## Existing Interactions & State
- interactions:
- global-state:
- local-state:
- api-boundaries:
- protected-business-logic:

## Replaceable Areas
- path:
- scope:
- allowed-changes:

## Protected Areas
- path:
- reason:

## Constraints
- no-new-dependencies:
- preserve-routing:
- preserve-api:
- preserve-business-logic:
- inferred-assumptions:
```
