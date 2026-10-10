# 质量检查与错误处理（Phase 4）

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：生成后的质量门禁、视觉验证、错误处理与跨 skill 协作边界。

## 目录

- Phase 4: 质量检查
  - 4.1 基础运行检查
  - 4.2 截图与视觉验证
  - 4.3 差异记录格式
  - 4.4 结果判定
- 多页面与多代理质量检查
- 错误处理
- 与其他 Skill 的协作边界

## Phase 4: 质量检查

Phase 4 必须在代码生成完成后实际执行，不能只勾选理论上的检查项。根据生成模式选择检查深度：

| 检查级别 | 适用模式 | 必须完成的内容 |
|----------|----------|----------------|
| Basic | Simple | 构建检查、页面可加载、基础响应式、截图验证 |
| Standard | Standard | Basic 全部内容，加交互、无障碍、性能和组件集成检查 |
| Full | Advanced | Standard 全部内容，加 API、多页面、动画、Canvas、3D 或 Electron 专项检查 |

### 4.1 基础运行检查

- [ ] 依赖和构建命令可用
- [ ] 项目可以启动或生成静态产物
- [ ] 目标页面可以访问
- [ ] 无新增编译错误、运行时错误或明显资源加载错误
- [ ] 生成文件都位于实现计划允许的范围内
- [ ] 没有未经确认的新依赖

### 4.2 截图与视觉验证

必须在至少两个固定视口进行验证：

- 桌面端：1440×900
- 移动端：375×812

验证顺序：

1. 启动目标项目并访问目标页面
2. 截取生成页面的固定视口截图
3. 与参考截图、参考图片或 `reference.md` 中的布局描述进行对比
4. 检查宏观布局、内容宽度、主要间距、字体层级、颜色和组件尺寸
5. 修正明显差异后重新截图
6. 将最终截图路径和仍存在的差异写入 `.layout-clone/validation.md`

如果没有可用的视觉对比工具，至少使用 DOM 尺寸、computed style 和截图人工检查完成降级验证，并注明验证方式。

### 4.3 差异记录格式

```yaml
validation:
  viewports:
    - name: "desktop"
      size: "1440x900"
      screenshot: "path/to/desktop.png"
      status: "pass | needs-fix"
    - name: "mobile"
      size: "375x812"
      screenshot: "path/to/mobile.png"
      status: "pass | needs-fix"
  differences:
    - area: "hero"
      type: "spacing | typography | color | layout | interaction"
      expected: "参考页面中的表现"
      actual: "生成页面中的表现"
      action: "已修正 | 保留差异 | 无法确认"
  limitations: []
```

### 4.4 结果判定

- `pass`：页面可运行，核心布局和主要交互已验证，无阻塞问题
- `needs-fix`：存在明显视觉、功能或构建问题，必须继续修正
- `blocked`：受缺失资源、不可访问 API、登录限制或环境能力限制影响，需记录原因后交付

不能因为无法访问参考源码或缺少视觉工具，就直接声称视觉一致；必须将相关内容标记为推断、未验证或限制。

生成完成后，逐项检查：

- [ ] **响应式**: 至少 3 个断点，内容不溢出，文字可读
- [ ] **语义化 HTML**: 使用 `<nav>`, `<main>`, `<section>`, `<article>` 等语义标签
- [ ] **无障碍**: 图片有 alt、表单有关联 label、交互元素可键盘访问
- [ ] **性能**: CSS 动画使用 transform/opacity 而非 top/left、图片有尺寸约束
- [ ] **一致性**: 间距、颜色、字号与目标项目设计系统一致
- [ ] **Anti-Slop**: 没有重复的渐变卡片、没有无意义的装饰线、布局有明确的视觉层级
- [ ] **交互完整性**: 所有交互功能是否实现、事件处理是否正确绑定
- [ ] **动画流畅度**: 无布局抖动、使用 transform/opacity、帧率稳定
- [ ] **状态管理合理性**: 无过度集中或分散、异步状态正确处理
- [ ] **动态渲染正确性**: key 使用正确、条件渲染逻辑完整、异步加载有 fallback

## 多页面与多代理质量检查

生成完成后，额外执行以下检查：

- [ ] **tokens.json 验证**: tokens.json 符合 W3C Design Tokens Format 规范（每个 token 包含 `$type` 和 `$value`）
- [ ] **Sub-component 集成检查**: 所有 SubAgent 生成的组件正确导入，无命名冲突，无状态覆盖
- [ ] **多页面链接完整性**: 所有 `<a href>` 指向已生成的页面文件
- [ ] **导航一致性**: 所有页面的 Header/Footer 链接列表完全一致
- [ ] **当前页高亮**: 每个页面正确高亮自身对应的导航项
- [ ] **数据模型一致性**: 生成的组件 Props 与 data_models 中的字段匹配
- [ ] **共享上下文完整性**: shared-context.json 中的所有组件路径有效

## 错误处理

| 情况 | 处理 |
|------|------|
| 参考路径不存在 | 报错，让用户提供正确路径 |
| 参考项目无前端代码 | 报错，说明不支持后端/纯 CLI 项目 |
| URL 无法访问 | 尝试 WebFetch，失败则报错让用户提供本地路径 |
| 技术栈完全不兼容 | 使用策略 C（灵感提取），明确告知用户适配后的差异 |
| 目标项目无样式文件 | 提示用户是否创建新样式文件，确认后继续 |
| 参考项目使用不常见的动画库 | 提取动画配置，尝试用 CSS 或目标项目已有方案等效实现 |
| 状态管理方案不兼容 | 提取状态结构，用目标项目的方案重新实现 |
| 复杂交互无法完全迁移 | 标注未迁移部分，提供 TODO 和实现建议 |
| Three.js 自定义 Shader | 提取 GLSL 代码，适配到目标项目的渲染器 |
| 3D 模型文件缺失 | 提取加载代码，提示用户手动拷贝模型文件 |
| 粒子系统性能问题 | 优化粒子数量、使用 InstancedMesh、降低 Overdraw |
| Electron IPC 通信复杂 | 提取 IPC 协议，生成对应的 main/preload/renderer 三端代码 |
| 多窗口状态同步 | 提取窗口间通信模式，用 IPC + localStorage 双重同步 |
| 自定义标题栏冲突 | 保留 -webkit-app-region 拖拽区域，适配目标平台窗口控制 |
| Electron 打包配置 | 提取 electron-builder 配置，生成对应的打包脚本 |
| 目标非 Electron 项目 | 将 Electron 特性降级为 Web 等效方案（如用 Browser Tab API 替代多窗口） |
| 线上 URL 无法加载 | Playwright 超时重试 3 次，失败则报错让用户提供截图或本地源码 |
| 线上站点有反爬/Cloudflare | 尝试设置 User-Agent 和等待 JS Challenge 通过，失败则降级为 WebFetch 静态分析 |
| 视觉模型分析结果偏差 | 对关键区域（如颜色值、间距值）进行 Step C 的精确提取来校正 |
| Computed Style 提取结果为空 | 可能是 Shadow DOM 或 iframe，尝试递归进入 shadowRoot 或 frame 提取 |
| 动画状态变化不可见 | 有些 hover 效果依赖外部库或 JS 事件，记录 transition 属性即可，不强制抓取截图对比 |

## 与其他 Skill 的协作边界

| 场景 | 用这个 skill | 用其他 skill |
|------|-------------|-------------|
| 克隆完整界面+交互+动画+3D+音频+Electron | ✓ | - |
| 只克隆静态布局 | ✓ | - |
| 只克隆 3D 场景 | ✓ (Phase 1.9) | - |
| 只克隆 Canvas 2D 效果 | ✓ (Phase 1.10) | - |
| 只克隆拖拽交互 | ✓ (Phase 1.12) | - |
| 只克隆音频可视化 | ✓ (Phase 1.13) | - |
| 只克隆 Electron 桌面端 | ✓ (Phase 1.15) | - |
| 从线上站点提取设计灵感 | ✓ (Dynamic Extraction) | - |
| 逆向工程 API 数据模型 | ✓ (Step E) | - |
| 导出 W3C 设计令牌 | ✓ (Step C.2) | - |
| 多页面站点克隆 | ✓ (Step A.5) | - |
| 多代理协作生成 | ✓ (Phase 3) | - |
| 对已有页面做精细视觉调整 | - | → `impeccable` |
| 从零设计一个 premium 风格页面 | - | → `looks-expensive` |
| 对已生成的布局做微调和 polish | 先生成，然后 | → `impeccable` 做精调 |
| 需要 anti-slop 检查 | Phase 4 自带 | 可追加 `looks-expensive` |

**协作流程**: 本 skill 生成布局+交互 → 用户确认结构和功能正确 → 按需加载其他 skill 做精调。
