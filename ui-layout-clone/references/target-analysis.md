# 目标项目分析（Phase 2）

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：分析用户目标项目的技术栈、设计系统与约束，输出 target.md 时阅读。

## 目录

- Phase 2: 目标项目分析
  - 2.1 判断目标项目类型
  - 2.2 技术栈与工程能力识别
  - 2.3 运行时与入口检查
  - 2.4 现有设计系统
  - 2.5 可复用资产清单
  - 2.6 现有交互、状态和业务边界
  - 2.7 确定可修改区域与保护区域
  - 2.8 写入 target.md

## Phase 2: 目标项目分析

**输入**: 用户项目路径、空项目目录、静态 HTML 项目，或用户指定的页面/区域。

**目标**: 在生成代码前确认目标项目的运行方式、可复用能力、业务边界和安全修改范围。Phase 2 不只扫描技术栈，还必须判断哪些内容可以改、哪些内容必须保留。

### 2.1 判断目标项目类型

先判断目标项目属于以下哪一种：

| 类型 | 判断条件 | 处理方式 |
|------|----------|----------|
| existing-project | 存在 package.json、源码目录和构建配置 | 完整分析现有技术栈和运行状态 |
| empty-project | 目录为空或只有少量基础文件 | 创建最小目标分析，沿用用户指定或默认技术栈 |
| static-html | 主要由 HTML、CSS、JS 文件组成 | 使用原生 HTML/CSS/JS 方案，避免引入框架 |
| partial-project | 只有部分页面或组件 | 分析可用部分，并标记缺失能力 |
| unknown | 无法可靠判断 | 只有在会影响生成方案时才询问用户 |

如果目标是空项目且用户没有指定技术栈，默认选择当前环境已有、最少依赖且最容易运行的方案，并在生成前说明该假设。

### 2.2 技术栈与工程能力识别

同 Phase 1.1 扫描基础技术栈，额外识别：

- 框架：React、Vue、Svelte、Next.js、Nuxt 等
- 语言：JavaScript、TypeScript
- 构建工具：Vite、Next、Nuxt、Webpack、Parcel
- 包管理器：npm、pnpm、yarn、bun
- 路由：React Router、Next Router、Vue Router 等
- CSS 方案：原生 CSS、CSS Modules、SCSS、Tailwind、styled-components、Emotion
- 组件库：Ant Design、MUI、shadcn、Element Plus 等
- 图标库：Lucide、Heroicons、Font Awesome 等
- 动画库：GSAP、Framer Motion、React Spring、Lottie 等
- 状态管理：Redux、Zustand、Jotai、Pinia、Vuex 等
- 数据请求：Fetch、Axios、SWR、React Query、Apollo 等
- 测试工具：Vitest、Jest、Playwright、Cypress 等
- Electron 或其他桌面端运行时

### 2.3 运行时与入口检查

对于可运行项目，执行以下检查；如果当前环境没有对应工具，执行可用的静态检查并记录降级原因：

1. 确认依赖是否已安装，识别正确的启动命令
2. 启动开发服务器或使用项目已有的预览命令
3. 确认默认入口、路由和目标页面
4. 检查启动错误、编译错误、控制台错误和资源加载错误
5. 在桌面端和移动端基准视口截取当前页面
6. 记录页面的加载态、空状态、错误态和主要交互状态

运行时检查结果必须写入 `target.md` 的 `Runtime Status`，不能只根据源码推断项目可用性。

### 2.4 现有设计系统

```
Grep pattern="var\(--"  →  现有 CSS 变量
Grep pattern="theme|tokens|design-system"  →  主题和 token 系统
Glob pattern="**/tokens/**" / "**/theme/**"  →  token 和主题文件
Glob pattern="**/globals.css" / "**/variables.css"  →  全局样式文件
Grep pattern="font-family|font-size|line-height"  →  排版系统
Grep pattern="spacing|breakpoint|radius|shadow"  →  间距、断点、圆角和阴影定义
```

提取颜色、字体、字号、字重、行高、间距、断点、圆角、阴影和主题切换方式。已有 token 必须优先复用，不得为了匹配参考图而无条件覆盖全局设计系统。

### 2.5 可复用资产清单

列出可以直接复用的内容：

- 组件：Button、Input、Modal、Card、Table、Layout 等
- Hooks：认证、主题、请求、媒体查询、滚动等 hooks
- 工具函数：className 合并、格式化、请求封装等
- 资源：Logo、图标、图片、字体、动画和模型
- 页面模板：已有 Layout、Header、Footer、Sidebar

生成前优先复用这些资产，避免重复实现或引入新的替代组件。

### 2.6 现有交互、状态和业务边界

```
Grep pattern="onClick|onChange|onSubmit|addEventListener"  →  交互事件
Grep pattern="useState|useReducer|ref\(|reactive\(|computed\("  →  局部状态
Grep pattern="createStore|configureStore|defineStore|create\("  →  全局状态
Grep pattern="fetch\(|axios|useQuery|useSWR|graphql"  →  数据请求边界
Grep pattern="gsap|framer-motion|anime\.js|react-spring"  →  动画方案
Grep pattern="electron|BrowserWindow|ipcMain"  →  Electron 配置
```

记录已有的交互、状态、API 请求、表单逻辑和业务组件。视觉复刻默认不得破坏这些逻辑；如果必须调整，必须在 `Protected Areas` 或 `Constraints` 中说明原因。

### 2.7 确定可修改区域与保护区域

如果用户已经明确修改范围，直接采用用户范围，不重复询问。只有在范围不明确、存在多个可能入口，或修改可能破坏业务逻辑时才询问。

必须将范围整理为：

```yaml
replaceable_areas:
  - path: "src/pages/Home.tsx"
    scope: "whole-page"
    allowed_changes:
      - layout
      - styles
      - local-interactions

protected_areas:
  - path: "src/services/api.ts"
    reason: "保留现有数据请求协议"
```

默认保护以下内容：认证、API 协议、路由契约、全局状态、业务数据结构和用户未授权的页面。只在用户明确要求时修改这些内容。

### 2.8 写入 target.md

