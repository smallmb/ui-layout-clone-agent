---
name: ui-layout-clone
version: 7.2.0
description: |
  全栈产品反向工程引擎：从本地源码（AST/Grep 静态分析）或线上已编译站点（无头浏览器 + 视觉模型 + DOM 嗅探 + 网络拦截）提取
  布局、设计系统、交互行为、动画效果、状态管理、动态渲染模式、数据流与 API Schema、
  3D 场景（Three.js/WebGL）、Canvas 2D 绘图、高级动画库（Lottie/Framer Motion/GSAP/React Spring）、
  拖拽交互、音频可视化、手势系统和 Electron 桌面端功能（窗口控制、IPC 通信、多窗口、系统托盘），
  适配用户技术栈生成完整的界面代码。
  支持 React/Vue/Svelte/HTML + Three.js + Canvas + Electron 等项目，
  覆盖 CSS 布局 + JS 交互 + 动画系统 + 状态管理 + 3D/2D 渲染 + 音频可视化 + 桌面端的完整迁移。
  v7.2.0：增加 Extractors 规范、Advanced 共享上下文协议与 Diff/Patch 安全修改机制；
  v7.1.0：核心流程分层、图片视觉复刻、目标项目运行分析、实现计划与验证闭环；
  v7.0.0 新增：数据驱动嗅探（NetworkInterception 拦截 XHR/Fetch 提取 API Schema）、
  W3C Design Tokens 标准导出（tokens.json）、多智能体协同架构（DelegateTask 分工生成）、
  多页面站点地图提取与导航互通协议。
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
  - WebFetch
  - Agent
  - Playwright
  - ExecuteScript
  - VisionModel
  - NetworkIntercept
  - DelegateTask
triggers:
  - 克隆布局
  - 复制界面
  - 参考设计
  - 分析布局
  - layout clone
  - ui clone
  - 参考项目布局
  - 布局克隆
  - 界面克隆
  - 克隆交互
  - 复制动效
  - 线上站点提取
  - 分析网站
  - 克隆网站
  - 嗅探设计系统
  - 克隆站点
  - 克隆整站
  - 多页面克隆
  - site clone
---

# UI Layout Clone

从参考项目提取完整的界面行为（布局 + 交互 + 动画 + 状态），适配用户技术栈生成高质量代码。

## 使用范围与流程分层

本 Skill 采用“核心流程 + 按需模块”的方式执行，避免简单的页面复刻被不必要的高级分析拖慢。

### 核心流程（默认启用）

适用于大多数 UI 复刻任务：

1. 判断参考输入类型（本地源码、线上 URL、图片或设计稿）
2. 分析参考内容的布局、视觉层级、设计系统和响应式特征
3. 分析目标项目的技术栈、目录结构、依赖和现有设计系统
4. 将参考结果和目标约束分别写入 `.layout-clone/reference.md` 与 `.layout-clone/target.md`
5. 生成布局、组件、样式和基础交互
6. 启动目标项目并进行固定视口截图验证
7. 根据视觉和功能差异进行修正，并记录无法还原的部分

### 按需启用模块

仅在用户明确要求，或分析结果检测到相关能力时启用：

- 动画与滚动动画
- API 与数据模型
- 多页面与站点地图
- Canvas 2D 与音频可视化
- Three.js、WebGL 与 Shader
- 拖拽、触摸和手势
- Electron 桌面端能力
- 多智能体协作

如果当前环境缺少某个专用工具，必须使用可用能力降级执行，并在结果中说明限制，不得因此中断整个核心流程。

### 图片与设计稿克隆

支持将 PNG、JPG、WEBP、截图或设计稿图片作为参考输入。图片输入只能提供视觉信息，不能直接提供原始 DOM、事件逻辑、真实字体文件或 API 数据，因此默认执行“视觉复刻”模式：

- 提取页面区域、布局骨架、组件层级和视觉优先级
- 估算颜色、字体层级、间距、圆角、阴影和响应式意图
- 识别按钮、表单、卡片、导航、弹窗等可见组件
- 对无法从图片确认的交互、状态和数据标注为推断项
- 生成后通过截图对比继续修正视觉差异

图片分析不应伪造不可观察的信息。除非用户另有说明，图片中的文字、图标和图片资源仅作为布局参考；需要可编辑文本、真实资源或完整交互时，应同时提供源码、线上 URL 或资源文件。

### 工具可用性与降级策略

执行前检查当前环境是否提供专用工具，并按以下顺序降级：

| 不可用能力 | 首选降级方式 |
|------------|--------------|
| VisionModel | 使用截图尺寸、DOM、computed style 和人工可见信息分析 |
| Playwright 或浏览器控制 | 使用源码、静态资源和本地构建检查 |
| NetworkIntercept | 分析公开脚本、请求封装和页面可见数据，不推断完整 API Schema |
| DelegateTask | 由主 Agent 按实现计划顺序完成模块 |
| 截图对比工具 | 使用固定视口截图、DOM 尺寸和 computed style 手动对照 |

降级后仍需完成核心流程，并在 `reference.md`、`validation.md` 或最终报告中记录缺失工具和由此产生的限制。工具不可用不是跳过分析或声称已验证的理由。

## 执行约束

- 参考项目的分析结果必须写入 `.layout-clone/reference.md`，作为 Phase 3 的输入
- 目标项目分析结果写入 `.layout-clone/target.md`
- 每次生成前必须先读取这两个文件，确保一致性
- 生成代码时必须使用目标项目的现有依赖，不引入新包
- 交互/动画/状态代码必须使用目标项目现有方案（除非目标项目没有且用户确认）
- 生成的 JS 代码必须遵循目标项目的代码风格

## 输入类型嗅探

**在执行任何 Phase 之前，必须先判断用户输入的参考项目来源类型。**

| 输入特征 | 类型判定 | 走向 |
|----------|----------|------|
| 本地路径（绝对路径或相对路径）且指向目录 | 本地源码项目 | → Phase 1（静态分析流程） |
| 本地路径指向 `.html`、`.vue`、`.tsx` 等源码文件 | 本地源码文件 | → Phase 1（静态分析流程） |
| `http://` 或 `https://` 开头的 URL | 线上站点 | → Dynamic Extraction Phase（动态嗅探流程） |
| 以 `localhost` 或 `127.0.0.1` 开头的 URL | 本地开发服务器 | → Dynamic Extraction Phase（动态嗅探流程） |
| 图片文件路径或用户上传的 PNG、JPG、JPEG、WEBP、GIF、SVG | 图片/设计稿 | → Image Extraction Phase（视觉复刻流程） |
| 无法判定 | 询问用户 | → AskUserQuestion 确认来源类型 |

**判定为本地路径时**：执行 Phase 1 全部静态分析逻辑（AST/Grep 模式），从源码中提取布局、设计系统、交互行为等完整信息。

**判定为线上 URL 时**：跳过 Phase 1 全部逻辑，进入下方全新的「动态视觉与 DOM 嗅探工作流」。提取结果同样写入 `.layout-clone/reference.md`，后续与 Phase 2、Phase 3 无缝对接。

---

## Image Extraction Phase: 图片与设计稿视觉复刻

**输入**: PNG、JPG、JPEG、WEBP、GIF、SVG、截图或设计稿图片。

**目标**: 从图片中提取可观察的视觉结构，生成适配目标项目的页面。图片分析只描述可见事实；无法确认的 DOM、交互、API、字体文件和资源来源必须标记为推断或未知。

### 图片分析流程

1. 读取图片尺寸、方向和可用分辨率
2. 分析页面边界、背景、主要区域和视觉层级
3. 识别 Header、Hero、导航、卡片、表单、按钮、列表、Footer 等可见组件
4. 估算颜色、字体层级、间距、圆角、阴影、对齐方式和容器宽度
5. 推断桌面端与移动端可能的重排方式；没有移动端图片时必须标记为推断
6. 将结果写入 `.layout-clone/reference.md`，并记录观察项、推断项和未知项
7. 结合 Phase 2 的目标项目分析生成实现计划
8. 生成代码后按照 Phase 4 的固定视口截图流程进行视觉验证

### 图片分析输出结构

```yaml
image_reference:
  source: "图片路径或上传标识"
  dimensions: "1440x900"
  layout_skeleton: []
  component_inventory: []
  visual_hierarchy: []
  design_system:
    colors: []
    typography: []
    spacing: []
    radius: []
    shadows: []
  observation: []
  inference: []
  unknown: []
  limitations: []
```

如果图片分辨率不足、存在裁切、文字无法识别或包含复杂图形，必须记录在 `limitations` 中，不得用虚构信息补全。

---

## Dynamic Extraction Phase: 线上 URL 动态嗅探工作流

**输入**: 线上站点 URL（已编译的生产环境页面）

### 认证会话与安全边界

动态分析需要登录时，按以下优先级获取访问状态：

1. 复用用户已经登录的浏览器会话
2. 由用户在浏览器中完成一次辅助登录
3. 使用用户明确提供的测试环境认证流程

不得向用户索取、保存或复制密码、Cookie、Access Token、Refresh Token 或 Authorization Header。认证状态只用于当前分析会话，并在结果中记录：

```yaml
authenticated_session:
  status: "available | required | unavailable"
  source: "existing-browser-session | user-assisted-login | test-auth-flow"
  limitations: []
```

如果无法取得认证状态，继续分析公开页面，并将受保护页面和 API 标记为未验证。

**目标**: 在无源码的情况下，通过无头浏览器、视觉模型和脚本注入，反推出站点的完整设计系统、布局骨架、交互状态和微交互动效参数。

### Step A: 视觉骨架分析

**目的**: 获取页面的宏观视觉层级和组件分布，作为后续精确提取的"地图"。

```yaml
操作:
  1. 使用 Playwright 打开目标 URL，等待 networkidle
  2. 设置视口为 1440×900（桌面端基准），执行全屏截图
  3. 设置视口为 375×812（移动端基准），执行全屏截图
  4. 将两张截图送入 VisionModel，要求分析并输出以下结构
```

**VisionModel 分析指令模板**:

```
你是一个资深前端架构师。请分析这张网页截图，输出以下信息（JSON 格式）：

1. "layout_skeleton": 页面的宏观布局骨架，包括：
   - header（位置、高度、是否固定）
   - sidebar（位置、宽度、是否可折叠）
   - main_content（主要区域占比）
   - footer（是否存在、高度）
   - 任何特殊区域（hero section、cards grid、feature rows 等）

2. "component_inventory": 视觉可见的组件类型和数量估计，
   包括按钮、卡片、表单、导航项、图标、图片、文字区块等

3. "visual_hierarchy": 视觉层级分析，
   包括主标题、副标题、正文、辅助文字的字号大小关系

4. "color_zones": 不同区域的主色调倾向
```

**输出结构**:

```yaml
visual_skeleton:
  desktop:
    layout_type: "header + sidebar + main" | "header + main" | "hero + cards grid" | ...
    regions:
      - name: "header"
        position: "fixed" | "sticky" | "static"
        height: "60px"  # 估算值
        contains: ["logo", "nav", "search", "user-avatar"]
      - name: "sidebar"
        width: "240px"  # 估算值
        contains: ["nav-items", "user-profile", "settings"]
      - name: "main"
        contains: ["content-area", "cards-grid", "pagination"]
  mobile:
    layout_type: "stacked" | "hamburger-menu" | ...
    differences_from_desktop: [...]
component_inventory:
  buttons: 12
  cards: 8
  form_inputs: 3
  nav_items: 6
  icons: 24
  images: 15
```

### Step A.5: 站点地图提取 (Site Map Extraction)

**目的**: 发现目标站点的所有内部页面 URL，构建页面图谱和导航层级关系，为多页面克隆提供路由蓝图。

**使用场景**: 当目标站点是多页面应用（MPA）或用户要求克隆整个网站时执行。单页面可跳过此步骤。

**执行脚本**:

```javascript
// ExecuteScript: 提取站点地图（注入到浏览器）
(async () => {
  // 1. 收集页面上所有内部链接
  const links = Array.from(document.querySelectorAll('a[href]'))
    .map(a => ({
      href: a.href,
      text: (a.textContent || '').trim().slice(0, 80),
      isInternal: a.href.startsWith(window.location.origin),
      isAnchor: a.href.includes('#'),
      isJs: a.href.startsWith('javascript:')
    }))
    .filter(l => l.isInternal && !l.isAnchor && !l.isJs);

  // 2. 去重（按 href）
  const unique = [...new Map(links.map(l => [l.href, l])).values()];

  // 3. 分析导航结构
  const nav = document.querySelector('nav, [role="navigation"], header');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href]'))
    .map(a => ({ label: a.textContent.trim(), href: a.href }))
    .filter(l => l.href.startsWith(window.location.origin)) : [];

  // 4. 分析页脚链接
  const footer = document.querySelector('footer, [role="contentinfo"]');
  const footerLinks = footer ? Array.from(footer.querySelectorAll('a[href]'))
    .map(a => ({ label: a.textContent.trim(), href: a.href }))
    .filter(l => l.href.startsWith(window.location.origin)) : [];

  // 5. 按路径层级分组
  const pages = unique.map(l => {
    const url = new URL(l.href);
    const segments = url.pathname.split('/').filter(Boolean);
    return {
      path: url.pathname,
      title: l.text,
      depth: segments.length,
      segments
    };
  }).sort((a, b) => a.depth - b.depth || a.path.localeCompare(b.path));

  return JSON.stringify({
    baseUrl: window.location.origin,
    totalPages: pages.length,
    pages,
    navigation: {
      primary: navLinks.map(l => ({
        label: l.label,
        path: new URL(l.href).pathname
      })),
      footer: footerLinks.map(l => ({
        label: l.label,
        path: new URL(l.href).pathname
      }))
    }
  }, null, 2);
})()
```

**输出结构** (写入 `.layout-clone/reference.md` 的 `site_map` 字段):

```yaml
site_map:
  baseUrl: "https://linear.app"
  totalPages: 6
  pages:
    - path: "/"
      title: "Linear"
      depth: 0
    - path: "/features"
      title: "Features"
      depth: 1
    - path: "/pricing"
      title: "Pricing"
      depth: 1
    - path: "/changelog"
      title: "Changelog"
      depth: 1
    - path: "/blog"
      title: "Blog"
      depth: 1
    - path: "/login"
      title: "Log in"
      depth: 1
  navigation:
    primary:
      - label: "Features"
        path: "/features"
      - label: "Pricing"
        path: "/pricing"
      - label: "Changelog"
        path: "/changelog"
      - label: "Blog"
        path: "/blog"
    footer:
      - label: "Features"
        path: "/features"
      - label: "Pricing"
        path: "/pricing"
```

### Extractor 执行优先级

`extractors/` 目录中的脚本是标准执行实现。正文中的内联 JavaScript 仅作为算法说明、兼容降级方案和结果格式参考；当对应 Extractor 可用时，不得重复编写或优先执行旧版内联脚本。

Extractor 的统一结果必须包含 `extractor`、`status`、`data` 和 `limitations`。提取结果写入 `reference.md` 或指定输出文件时，只使用 `data` 中的标准字段。

### Step B: 降噪与语义结构提取

优先调用 `extractors/semantic-dom.js`。它支持语义节点、Shadow DOM、同源 iframe 和跨域限制记录。

**目的**: 不抓取原始 DOM（太嘈杂），而是通过脚本注入提取带语义的结构树，转换为轻量级 JSON/Markdown。

**禁止行为**: 不要直接 `document.documentElement.outerHTML` 抓取全部 DOM。原始 DOM 包含大量无意义的 wrapper div、内联样式、webpack hash class names，直接使用会产生巨大的噪音。

**执行脚本**:

```javascript
// ExecuteScript: 提取语义化 DOM 结构（注入到浏览器）
(() => {
  // 定义需要提取的语义化标签和角色
  const SEMANTIC_TAGS = new Set([
    'header', 'nav', 'main', 'aside', 'footer', 'section', 'article',
    'form', 'button', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'input', 'textarea', 'select', 'img', 'video', 'canvas', 'svg'
  ]);

  const ARIA_ROLES = new Set([
    'navigation', 'banner', 'main', 'complementary', 'contentinfo',
    'button', 'link', 'dialog', 'menu', 'menuitem', 'tab', 'tabpanel',
    'search', 'form', 'list', 'listitem', 'heading', 'img', 'figure'
  ]);

  function extractNode(el, depth = 0) {
    if (depth > 8) return null; // 限制深度，防止无限递归
    if (el.nodeType !== 1) return null; // 只处理元素节点

    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const ariaLabel = el.getAttribute('aria-label');
    const className = el.className && typeof el.className === 'string'
      ? el.className.split(' ').slice(0, 5).join(' ')  // 只保留前5个class
      : '';

    // 判断是否为语义化节点
    const isSemantic = SEMANTIC_TAGS.has(tag) || (role && ARIA_ROLES.has(role));
    if (!isSemantic && depth > 2) return null; // 非语义节点在深层被过滤

    const node = {
      tag,
      role: role || undefined,
      class: className || undefined,
      ariaLabel: ariaLabel || undefined,
      text: undefined,
      children: []
    };

    // 提取直接文本内容（不含子元素的文本）
    const directText = Array.from(el.childNodes)
      .filter(n => n.nodeType === 3)
      .map(n => n.textContent.trim())
      .join('')
      .slice(0, 100); // 截断过长文本
    if (directText) node.text = directText;

    // 递归提取子节点
    for (const child of el.children) {
      const childNode = extractNode(child, depth + 1);
      if (childNode) node.children.push(childNode);
    }

    // 清理空 children
    if (node.children.length === 0) delete node.children;

    return node;
  }

  const body = document.body;
  const tree = extractNode(body);
  return JSON.stringify(tree, null, 2);
})()
```

**输出结构** (写入 `.layout-clone/reference.md` 的 semantic_tree 字段):

```json
{
  "tag": "body",
  "children": [
    {
      "tag": "header",
      "role": "banner",
      "class": "site-header sticky top-0 z-50",
      "children": [
        { "tag": "nav", "role": "navigation", "ariaLabel": "Main navigation", "children": [...] },
        { "tag": "div", "class": "search-bar", "children": [...] }
      ]
    },
    {
      "tag": "main",
      "children": [
        { "tag": "section", "class": "hero", "children": [...] },
        { "tag": "section", "class": "features-grid", "children": [...] }
      ]
    }
  ]
}
```

### Step C: 标准设计资产导出 (W3C Design Tokens)

优先调用 `extractors/design-tokens.js`。内联脚本只用于没有 Extractor 执行能力时的降级方案。最终写入 `.layout-clone/tokens.json` 的内容使用 Extractor 返回的 `data.tokens`，原始采样值保存在 `data.rawValues`。

**目的**: 遍历核心节点，提取浏览器实际计算后的样式值，生成符合 **W3C Design Tokens Format** 的 `tokens.json` 文件。该文件可直接导入 Figma Token Studio 插件或用于 CI/CD 设计同步。

### Step C.0: Design Tokens 输出约束

`tokens.json` 是对实际样式的结构化摘要，不得将推测值伪装成参考页面的真实 token。每个可输出的 token 必须包含 `$type` 和 `$value`；无法可靠归类的值放入 `metadata` 或 `limitations`，不得强行归入颜色、字体或间距。

生成后必须执行以下校验：

- [ ] JSON 可以被解析
- [ ] 每个 token 都包含 `$type` 和 `$value`
- [ ] `color` 使用颜色类型，尺寸使用 `dimension` 类型，字体使用 `fontFamily` 类型
- [ ] 没有将多个不相关的 computed style 值错误合并成一个 token
- [ ] `reference.md` 中标注 token 的提取来源和限制

如果无法验证某个外部工具（例如 Token Studio）的兼容性，只能表述为“符合当前导出结构”或“可尝试导入”，不能保证第三方工具一定兼容。

**执行脚本**:

```javascript
// ExecuteScript: 提取核心节点的 computed style 并生成 W3C Design Tokens
(() => {
  const selectors = [
    'header', 'nav', 'main', 'aside', 'footer',
    'section', 'article',
    'h1', 'h2', 'h3', 'h4',
    'button', 'a',
    '[class*="card"]', '[class*="Card"]',
    '[class*="modal"]', '[class*="Modal"]',
    '[class*="sidebar"]', '[class*="Sidebar"]'
  ];

  const colorSet = new Set();
  const fontSet = new Set();
  const sizeSet = new Set();
  const spacingSet = new Set();
  const radiusSet = new Set();
  const shadowSet = new Set();

  for (const sel of selectors) {
    const elements = document.querySelectorAll(sel);
    for (const el of Array.from(elements).slice(0, 5)) {
      const cs = window.getComputedStyle(el);
      if (cs.color && cs.color !== 'rgb(0, 0, 0)') colorSet.add(cs.color);
      if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)')
        colorSet.add(cs.backgroundColor);
      fontSet.add(cs.fontFamily.split(',')[0].trim().replace(/"/g, ''));
      sizeSet.add(cs.fontSize);
      if (cs.borderRadius !== '0px') radiusSet.add(cs.borderRadius);
      if (cs.boxShadow && cs.boxShadow !== 'none') shadowSet.add(cs.boxShadow);
      const spacingVals = [cs.padding, cs.margin].join(' ').match(/\d+px/g) || [];
      spacingVals.forEach(v => spacingSet.add(v));
    }
  }

  // --- W3C Design Tokens Format ---
  const w3cTokens = {
    "$type": "object",
    "color": {},
    "typography": {},
    "spacing": {},
    "borderRadius": {},
    "boxShadow": {}
  };

  // 颜色 token（rgb 格式，W3C 推荐）
  let ci = 0;
  for (const c of Array.from(colorSet).slice(0, 15)) {
    const name = ci === 0 ? "primary" : ci < 5 ? `neutral-${ci}` : `color-${ci}`;
    w3cTokens.color[name] = { "$type": "color", "$value": c };
    ci++;
  }

  // 排版 token
  const fonts = Array.from(fontSet).slice(0, 3);
  const sizes = Array.from(sizeSet).sort((a, b) => parseInt(a) - parseInt(b));
  const weights = ["400", "500", "600", "700"];
  w3cTokens.typography.fontFamily = { "$type": "fontFamily", "$value": fonts.join(", ") };
  let si = 0;
  for (const s of sizes) {
    const level = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"][si] || `size-${si}`;
    w3cTokens.typography[level] = {
      "$type": "typography",
      "$value": { fontFamily: fonts[0], fontSize: s, fontWeight: weights[1], lineHeight: "1.5" }
    };
    si++;
  }

  // 间距 token
  let pi = 0;
  for (const p of Array.from(spacingSet).sort((a, b) => parseInt(a) - parseInt(b))) {
    const name = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"][pi] || `space-${pi}`;
    w3cTokens.spacing[name] = { "$type": "dimension", "$value": p };
    pi++;
  }

  // 圆角 token
  let ri = 0;
  for (const r of radiusSet) {
    const name = r === "0px" ? "none" : r === "9999px" ? "full" : `radius-${ri}`;
    w3cTokens.borderRadius[name] = { "$type": "dimension", "$value": r };
    ri++;
  }

  // 阴影 token
  let shi = 0;
  for (const s of Array.from(shadowSet).slice(0, 5)) {
    const name = ["sm", "md", "lg", "xl", "2xl"][shi] || `shadow-${shi}`;
    w3cTokens.boxShadow[name] = { "$type": "shadow", "$value": s };
    shi++;
  }

  return JSON.stringify(w3cTokens, null, 2);
})()
```

**输出要求**:

1. **必须将 W3C Design Tokens 写入独立文件**: `.layout-clone/tokens.json`
2. **该文件格式符合 W3C Design Tokens Community Group 规范**，可直接导入 Figma Token Studio
3. **同时在 reference.md 的 design_system 字段保留人类可读的摘要版本**

**tokens.json 示例**:

```json
{
  "$type": "object",
  "color": {
    "primary": { "$type": "color", "$value": "rgb(59, 130, 246)" },
    "neutral-1": { "$type": "color", "$value": "rgb(31, 41, 55)" },
    "neutral-2": { "$type": "color", "$value": "rgb(75, 85, 99)" },
    "neutral-3": { "$type": "color", "$value": "rgb(156, 163, 175)" },
    "neutral-4": { "$type": "color", "$value": "rgb(209, 213, 219)" }
  },
  "typography": {
    "fontFamily": { "$type": "fontFamily", "$value": "Inter" },
    "base": {
      "$type": "typography",
      "$value": { "fontFamily": "Inter", "fontSize": "16px", "fontWeight": "400", "lineHeight": "1.5" }
    },
    "lg": {
      "$type": "typography",
      "$value": { "fontFamily": "Inter", "fontSize": "18px", "fontWeight": "500", "lineHeight": "1.5" }
    }
  },
  "spacing": {
    "xs": { "$type": "dimension", "$value": "4px" },
    "sm": { "$type": "dimension", "$value": "8px" },
    "md": { "$type": "dimension", "$value": "16px" },
    "lg": { "$type": "dimension", "$value": "24px" },
    "xl": { "$type": "dimension", "$value": "32px" }
  },
  "borderRadius": {
    "sm": { "$type": "dimension", "$value": "4px" },
    "md": { "$type": "dimension", "$value": "8px" },
    "lg": { "$type": "dimension", "$value": "12px" },
    "full": { "$type": "dimension", "$value": "9999px" }
  },
  "boxShadow": {
    "sm": { "$type": "shadow", "$value": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
    "md": { "$type": "shadow", "$value": "0 4px 6px -1px rgb(0 0 0 / 0.1)" }
  }
}
```

**reference.md 中的 design_system 摘要**:

```yaml
design_system:
  tokens_file: ".layout-clone/tokens.json"  # W3C Design Tokens，可导入 Figma
  colors:
    primary: "rgb(59, 130, 246)"
    neutral: ["rgb(31, 41, 55)", "rgb(75, 85, 99)", "rgb(156, 163, 175)", "rgb(209, 213, 219)"]
  typography:
    font-family: "Inter"
    scale: ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"]
  spacing: ["4px", "8px", "12px", "16px", "20px", "24px", "32px", "40px", "48px", "64px"]
  radius: ["0px", "4px", "8px", "12px", "9999px"]
  shadows: ["0 1px 2px 0 rgb(0 0 0 / 0.05)", "0 4px 6px -1px rgb(0 0 0 / 0.1)"]
```

#### Step C.2: W3C Design Tokens 导出

**目的**: 将 Step C 提取的设计系统转换为 W3C Design Tokens Format 规范的 `tokens.json`，可直接导入 Figma Token Studio 或其他设计工具。

**W3C Design Tokens Format 规范要求**:
- 每个 token 必须包含 `$type` 和 `$value` 字段
- 支持嵌套 group 结构
- 标准类型: `color`, `dimension`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier`

**转换逻辑**:

```yaml
转换规则:
  颜色:
    $type: "color"
    $value: 原始 RGB/HEX 值
    色阶(如 neutral): 拆分为 neutral-100, neutral-200, ...
  字体:
    fontFamily → $type: "fontFamily", $value: [字体名数组]
    fontSize → $type: "dimension", $value: "16px"
    fontWeight → $type: "fontWeight", $value: 400 (整数)
  间距:
    $type: "dimension"
    $value: "4px"
    命名: space-1, space-2, ...
  圆角:
    $type: "dimension"
    $value: "8px"
    命名: radius-1, radius-2, ...
  阴影:
    $type: "shadow"
    $value: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  动效:
    duration → $type: "duration", $value: "250ms"
    easing → $type: "cubicBezier", $value: [x1, y1, x2, y2]
```

**输出文件**: `.layout-clone/tokens.json`

**输出结构示例**:

```json
{
  "$type": "object",
  "$value": {
    "color": {
      "primary": { "$type": "color", "$value": "#5e6ad2" },
      "secondary": { "$type": "color", "$value": "#7170ff" },
      "background": { "$type": "color", "$value": "#08090a" },
      "text-primary": { "$type": "color", "$value": "#f7f8f8" },
      "text-secondary": { "$type": "color", "$value": "#d0d6e0" },
      "neutral-100": { "$type": "color", "$value": "#08090a" },
      "neutral-200": { "$type": "color", "$value": "#0f1011" },
      "neutral-300": { "$type": "color", "$value": "#141516" }
    },
    "typography": {
      "font-family": { "$type": "fontFamily", "$value": ["Inter", "SF Pro Display", "sans-serif"] },
      "font-size-xs": { "$type": "dimension", "$value": "0.625rem" },
      "font-size-sm": { "$type": "dimension", "$value": "0.875rem" },
      "font-size-base": { "$type": "dimension", "$value": "0.9375rem" },
      "font-size-lg": { "$type": "dimension", "$value": "1.0625rem" },
      "font-size-xl": { "$type": "dimension", "$value": "1.5rem" },
      "font-size-2xl": { "$type": "dimension", "$value": "2rem" },
      "font-size-3xl": { "$type": "dimension", "$value": "3rem" },
      "font-size-4xl": { "$type": "dimension", "$value": "4.5rem" },
      "font-weight-normal": { "$type": "fontWeight", "$value": 400 },
      "font-weight-medium": { "$type": "fontWeight", "$value": 510 },
      "font-weight-semibold": { "$type": "fontWeight", "$value": 590 }
    },
    "spacing": {
      "space-1": { "$type": "dimension", "$value": "4px" },
      "space-2": { "$type": "dimension", "$value": "8px" },
      "space-3": { "$type": "dimension", "$value": "12px" },
      "space-4": { "$type": "dimension", "$value": "16px" },
      "space-6": { "$type": "dimension", "$value": "24px" },
      "space-8": { "$type": "dimension", "$value": "32px" },
      "space-12": { "$type": "dimension", "$value": "48px" },
      "space-16": { "$type": "dimension", "$value": "64px" }
    },
    "radius": {
      "radius-sm": { "$type": "dimension", "$value": "4px" },
      "radius-md": { "$type": "dimension", "$value": "8px" },
      "radius-lg": { "$type": "dimension", "$value": "12px" },
      "radius-xl": { "$type": "dimension", "$value": "16px" },
      "radius-full": { "$type": "dimension", "$value": "9999px" }
    },
    "shadow": {
      "shadow-sm": { "$type": "shadow", "$value": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
      "shadow-md": { "$type": "shadow", "$value": "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
      "shadow-lg": { "$type": "shadow", "$value": "0 10px 15px -3px rgb(0 0 0 / 0.1)" }
    },
    "motion": {
      "duration-fast": { "$type": "duration", "$value": "100ms" },
      "duration-normal": { "$type": "duration", "$value": "250ms" },
      "duration-slow": { "$type": "duration", "$value": "400ms" },
      "easing-default": { "$type": "cubicBezier", "$value": [0.25, 0.46, 0.45, 0.94] },
      "easing-in-out": { "$type": "cubicBezier", "$value": [0.645, 0.045, 0.355, 1] }
    }
  }
}
```

### Step D: 交互状态触探

交互分析分为两层：

1. **静态线索层**：调用 `extractors/interactive-states.js`，识别可交互元素、可聚焦元素、ARIA 状态、transition 和可能的事件入口；该脚本不会主动触发动作。
2. **动态验证层**：由浏览器工具在安全动作白名单内执行 `hover`、`focus`、`scroll`、打开菜单和切换 Tab，并记录前后截图或 computed style 差异。

默认禁止自动执行提交表单、支付、删除、发送消息、修改账户设置或其他不可逆操作。普通链接点击需要目标明确且可恢复。

**目的**: 通过 Playwright 自动化遍历主要交互元素，抓取 hover/click/focus 状态前后的样式变化和 transition/animation 属性，反推微交互动效参数。

**执行流程**:

```yaml
操作:
  1. 使用 Playwright 选择页面内主要交互元素（按钮、卡片、导航项、输入框、链接）
  2. 对每个元素执行以下状态序列：
     - baseline: 记录默认状态的 computed style
     - hover: 执行 page.hover() → 等待 300ms → 记录样式变化
     - focus: 执行 page.focus() → 等待 200ms → 记录样式变化（仅表单元素）
     - active: 执行 page.mouse.down() → 等待 100ms → 记录样式变化 → page.mouse.up()
  3. 提取 transition 和 animation 属性
  4. 识别 CSS transition 的持续时间、延迟、缓动函数
```

**执行脚本**:

```javascript
// ExecuteScript: 提取交互状态样式变化
(async () => {
  // 收集主要交互元素的选择器
  const interactiveSelectors = [
    'button', 'a[href]', '[role="button"]', '[role="tab"]',
    'input', 'textarea', 'select',
    '[class*="card"]', '[class*="Card"]',
    '[class*="nav-item"]', '[class*="Nav"] li a',
    '[class*="sidebar"] a', '[class*="menu"] a'
  ];

  const results = [];

  for (const sel of interactiveSelectors) {
    const elements = document.querySelectorAll(sel);
    for (const el of Array.from(elements).slice(0, 3)) { // 每类最多3个
      const cs = window.getComputedStyle(el);
      const transition = cs.transition;
      const animation = cs.animation;

      // 解析 transition 属性
      let transitionInfo = null;
      if (transition && transition !== 'all 0s ease 0s') {
        const parts = transition.split(',');
        transitionInfo = parts.map(p => {
          const [prop, dur, delay, timing] = p.trim().split(/\s+/);
          return {
            property: prop,
            duration: dur,
            delay: delay || '0s',
            timingFunction: timing || 'ease'
          };
        });
      }

      // 解析 animation 属性
      let animationInfo = null;
      if (animation && animation !== 'none') {
        const parts = animation.split(',');
        animationInfo = parts.map(p => {
          const [name, dur, delay, timing, iteration, direction, fill] = p.trim().split(/\s+/);
          return {
            name,
            duration: dur,
            delay: delay || '0s',
            timingFunction: timing || 'ease',
            iterationCount: iteration || '1',
            direction: direction || 'normal',
            fillMode: fill || 'none'
          };
        });
      }

      // 获取 @keyframes 规则（如果能识别到 animation-name）
      let keyframes = null;
      if (animationInfo && animationInfo[0] && animationInfo[0].name !== 'none') {
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule.type === CSSRule.KEYFRAMES_RULE &&
                  rule.name === animationInfo[0].name) {
                keyframes = {
                  name: rule.name,
                  steps: Array.from(rule.cssRules).map(r => ({
                    keyText: r.keyText,
                    style: r.style.cssText
                  }))
                };
                break;
              }
            }
          } catch (e) { /* 跨域样式表跳过 */ }
        }
      }

      results.push({
        selector: sel,
        tag: el.tagName.toLowerCase(),
        class: (el.className || '').toString().split(' ').slice(0, 3).join(' '),
        text: (el.textContent || '').trim().slice(0, 50),
        transition: transitionInfo,
        animation: animationInfo,
        keyframes,
        defaultStyles: {
          color: cs.color,
          backgroundColor: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : undefined,
          transform: cs.transform !== 'none' ? cs.transform : undefined,
          opacity: cs.opacity !== '1' ? cs.opacity : undefined,
          boxShadow: cs.boxShadow !== 'none' ? cs.boxShadow : undefined
        }
      });
    }
  }

  return JSON.stringify(results, null, 2);
})()
```

**Playwright 状态触探脚本**:

```yaml
# Playwright 自动化: hover/click 状态遍历
操作:
  1. page.goto(url) → 等待 load
  2. page.setViewportSize({ width: 1440, height: 900 })
  3. 等待 page.waitForTimeout(1000) 让动画完成
  4. 遍历 interactiveSelectors：
     for selector in selectors:
       elements = page.locator(selector).all()
       for element in elements.slice(0, 3):
         # baseline 截图
         baseline_screenshot = page.screenshot()

         # hover 状态
         element.hover()
         page.waitForTimeout(350)
         hover_screenshot = page.screenshot()

         # 执行 JS 提取 hover 前后样式差异
         style_diff = page.evaluate("""
           const el = document.querySelector('${selector}');
           const cs = window.getComputedStyle(el);
           return {
             color: cs.color,
             backgroundColor: cs.backgroundColor,
             transform: cs.transform,
             boxShadow: cs.boxShadow,
             opacity: cs.opacity
           };
         """)

         # click 状态（对于按钮/链接）
         if selector in ['button', 'a[href]', '[role="button"]']:
           element.click({ modifiers: ['Shift'] })  # Shift+click 防止导航
           page.waitForTimeout(150)
           active_screenshot = page.screenshot()

         # 记录结果
         results.push({ selector, style_diff })
```

**输出结构** (合并到 `.layout-clone/reference.md` 的 interactions 字段):

```yaml
interactions:
  hover_effects:
    - selector: "button"
      changes:
        backgroundColor: "rgb(37, 99, 235) → rgb(29, 78, 216)"  # 深一度
        boxShadow: "none → 0 4px 6px -1px rgb(0 0 0 / 0.1)"
        transition: "background-color 150ms ease, box-shadow 150ms ease"
    - selector: "a[href]"
      changes:
        color: "rgb(59, 130, 246) → rgb(37, 99, 235)"
        textDecoration: "none → underline"
        transition: "color 150ms ease, text-decoration-color 150ms ease"
    - selector: "[class*='card']"
      changes:
        transform: "none → translateY(-2px)"
        boxShadow: "0 1px 3px → 0 10px 15px -3px"
        transition: "transform 200ms ease, box-shadow 200ms ease"
  click_effects:
    - selector: "button"
      changes:
        transform: "none → scale(0.98)"
        transition: "transform 100ms ease"
  focus_effects:
    - selector: "input"
      changes:
        borderColor: "rgb(209, 213, 219) → rgb(59, 130, 246)"
        boxShadow: "none → 0 0 0 3px rgb(59, 130, 246 / 0.1)"
        transition: "border-color 150ms ease, box-shadow 150ms ease"
  keyframes:
    - name: "fadeIn"
      steps:
        - keyText: "0%"
          style: "opacity: 0; transform: translateY(10px)"
        - keyText: "100%"
          style: "opacity: 1; transform: translateY(0)"
    - name: "slideIn"
      steps:
        - keyText: "0%"
          style: "transform: translateX(-100%)"
        - keyText: "100%"
          style: "transform: translateX(0)"
```

### Step E: 网络拦截与 API 数据模型提取 (Network Interception)

优先调用 `extractors/network-schema.js`。宿主网络监听器必须把允许分析的 JSON 响应样本写入 `window.__uiLayoutCloneResponses`；Extractor 只做脱敏和结构推断，不负责获取认证凭据。

**目的**: 在 Playwright 会话期间拦截 XHR/Fetch 请求，提取 API 响应结构并推断数据模型（Data Schema）。

**使用场景**: 当目标站点是 SPA（单页应用）或使用 REST/GraphQL API 时，提取其数据结构用于生成 Mock 数据和类型定义。

**执行流程**:

```yaml
操作:
  1. 在 Playwright 启动后、页面加载前，注册网络拦截监听器
  2. 使用 page.on('response') 捕获所有网络响应
  3. 过滤 Content-Type 为 application/json 的响应
  4. 分析 JSON 结构，推断数据模型（实体、字段类型、嵌套关系）
  5. 按 API 路径分组，生成 Mock API 结构
  6. 将提取的数据模型写入 reference.md 的 data_models 字段
```

**Playwright 拦截脚本**:

```yaml
# Playwright: 网络拦截流程
操作:
  1. page.on('response', async (response) => {
       const contentType = response.headers()['content-type'] || '';
       if (contentType.includes('application/json')) {
         const body = await response.json();
         // 存储到 window.__uiLayoutCloneResponses 数组
       }
     })
  2. page.goto(url) → 等待 load
  3. page.reload() → 重新加载以捕获初始 API 调用
  4. 等待 page.waitForTimeout(3000)
  5. 执行交互操作（点击、滚动、导航）触发更多 API 请求
  6. 等待 page.waitForTimeout(2000)
   7. 提取 window.__uiLayoutCloneResponses 数据
```

**数据结构推断脚本**:

```javascript
// ExecuteScript: 分析拦截到的 API 响应
(() => {
  const responses = window.__uiLayoutCloneResponses || [];

  // 按路径分组
  const grouped = {};
  for (const resp of responses) {
    const url = new URL(resp.url);
    const path = url.pathname;
    if (!grouped[path]) grouped[path] = [];
    grouped[path].push(resp);
  }

  // 推断每个端点的数据模型
  const dataModels = {};
  for (const [path, resps] of Object.entries(grouped)) {
    const sample = resps[0];
    dataModels[path] = {
      method: sample.method,
      status: sample.status,
      schema: inferSchema(sample.body),
      fields: Object.keys(sample.body || {}),
      sampleCount: resps.length
    };
  }

  function inferSchema(obj) {
    if (obj === null || obj === undefined) return { type: 'null' };
    if (Array.isArray(obj)) {
      return {
        type: 'array',
        length: obj.length,
        itemSchema: obj.length > 0 ? inferSchema(obj[0]) : null
      };
    }
    if (typeof obj !== 'object') return { type: typeof obj };
    const schema = {};
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        schema[key] = {
          type: 'array',
          itemSchema: value.length > 0 ? inferSchema(value[0]) : null
        };
      } else if (typeof value === 'object' && value !== null) {
        schema[key] = inferSchema(value);
      } else {
        schema[key] = { type: typeof value, sample: value };
      }
    }
    return schema;
  }

  return JSON.stringify(dataModels, null, 2);
})()
```

**输出结构** (写入 `.layout-clone/reference.md` 的 data_models 字段):

```yaml
data_models:
  "/api/users":
    method: "GET"
    status: 200
    sampleCount: 3
    fields: ["data", "meta"]
    schema:
      type: "object"
      data:
        type: "array"
        itemSchema:
          type: "object"
          id: { type: "number", sample: 1 }
          name: { type: "string", sample: "张三" }
          email: { type: "string", sample: "zhang@example.com" }
          avatar: { type: "string", sample: "https://..." }
          role: { type: "string", sample: "admin" }
      meta:
        type: "object"
        total: { type: "number", sample: 100 }
        page: { type: "number", sample: 1 }
  "/api/posts":
    method: "GET"
    status: 200
    sampleCount: 5
    fields: ["data"]
    schema:
      type: "object"
      data:
        type: "array"
        itemSchema:
          type: "object"
          id: { type: "number" }
          title: { type: "string" }
          content: { type: "string" }
          author:
            type: "object"
            id: { type: "number" }
            name: { type: "string" }
          tags:
            type: "array"
            itemSchema: { type: "string" }
          publishedAt: { type: "string" }
  "/api/auth/login":
    method: "POST"
    status: 200
    sampleCount: 1
    fields: ["token", "user"]
    schema:
      type: "object"
      token: { type: "string" }
      user:
        type: "object"
        id: { type: "number" }
        email: { type: "string" }
```

### Dynamic Extraction Phase: 写入 reference.md

完成 Step A ~ E 后，将所有提取结果写入 `.layout-clone/reference.md`，格式与本地静态分析的输出**完全一致**，确保 Phase 3 无需区分来源。同时将 W3C Design Tokens 写入独立的 `.layout-clone/tokens.json` 文件。

```markdown
# Reference Analysis: [站点URL或名称]

> 提取方式: Dynamic Extraction (v7.0.0)
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

---

## Phase 1: 参考项目分析（本地源码模式）

**输入**: 本地参考项目的路径

**注意**: 此 Phase 仅在输入类型嗅探判定为「本地路径」时执行。线上 URL 请执行上方的 Dynamic Extraction Phase。

### 1.1 技术栈识别

```bash
# 扫描项目根目录
Glob pattern="**/*.{json,lock,toml}"  →  读取 package.json / requirements.txt / pyproject.toml
Glob pattern="**/*.{html,jsx,tsx,vue,svelte}"  →  识别框架
Glob pattern="**/*.{css,scss,less,styl}"  →  识别样式方案
```

**识别清单**:
| 信号 | 判断 |
|------|------|
| `electron` in dependencies 或 devDependencies | Electron 桌面端 |
| `main.js` / `preload.js` 在项目中 | Electron 主进程 |
| `electron-builder` / `electron-forge` | Electron 打包工具 |
| `next.config.*` | Next.js |
| `nuxt.config.*` | Nuxt |
| `vite.config.*` | Vite |
| `.css` 文件 | 原生 CSS |
| `*.scss` / `*.module.scss` | SCSS / CSS Modules |
| `tailwind.config.*` | Tailwind CSS |
| `styled-components` / `emotion` | CSS-in-JS |

### 1.2 布局结构提取

搜索布局相关文件并读取：

```
Grep pattern="display:\s*(grid|flex)"  →  提取 Grid/Flex 容器
Grep pattern="@media"  →  提取响应式断点
Grep pattern="position:\s*(fixed|sticky|absolute)"  →  提取定位模式
```

**提取项**:
- 页面骨架结构（header/sidebar/main/footer）
- Grid 模板（grid-template-columns / grid-template-rows）
- Flex 方向和对齐（flex-direction, justify-content, align-items）
- 间距系统（gap, margin, padding 的规律值）
- 响应式断点（sm/md/lg/xl 的断点值和对应变化）

### 1.3 设计系统提取

```
Grep pattern="#[0-9a-fA-F]{3,8}"  →  颜色值
Grep pattern="rgb[a]?\("  →  颜色值（函数格式）
Grep pattern="var\(--[^)]+\)"  →  CSS 变量/token
Grep pattern="font-family"  →  字体
Grep pattern="font-size"  →  字号系统
Grep pattern="border-radius"  →  圆角系统
Grep pattern="box-shadow"  →  阴影系统
Grep pattern="transition|animation|@keyframes"  →  CSS 动效
```

**输出结构**:
```yaml
colors:
  primary: #xxx
  secondary: #xxx
  neutral: [#xxx, #xxx, ...]  # 按灰度排列
  accent: #xxx
typography:
  font-family: "xxx"
  scale: [12, 14, 16, 18, 20, 24, 32, 48]
  weights: [400, 500, 600, 700]
spacing: [4, 8, 12, 16, 24, 32, 48, 64]
radius: [0, 4, 8, 12, 16, 9999]
shadows: [sm, md, lg]  # 列出实际值
breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 }
```

### 1.4 组件模式提取

```
Grep pattern="className.*card|className.*Card"  →  卡片模式
Grep pattern="className.*nav|className.*Nav|className.*menu"  →  导航模式
Grep pattern="className.*modal|className.*dialog"  →  弹窗模式
Grep pattern="className.*btn|className.*button"  →  按钮模式
Glob pattern="**/components/**/*.{tsx,jsx,vue}"  →  列出所有组件
```

对每个关键组件：读取源码 → 提取 props 接口 + 样式模式 + 变体逻辑。

### 1.5 JS 交互行为提取

```
Grep pattern="onClick|onChange|onSubmit|addEventListener"  →  事件处理器
Grep pattern="useEffect|componentDidMount|onMounted"  →  生命周期/副作用
Grep pattern="useCallback|useMemo|memo\("  →  性能优化模式
Glob pattern="**/hooks/**/*.{ts,tsx,js,jsx}"  →  自定义 hooks
```

**提取项**:
- 事件处理模式（点击、输入、提交、键盘）
- DOM 操作方式（直接操作 vs 声明式）
- 表单验证逻辑（前端校验规则、错误提示）
- 滚动行为（平滑滚动、锚点跳转、滚动加载）
- 拖拽交互（拖拽排序、拖拽放置）
- 焦点管理（焦点陷阱、Tab 键导航）

### 1.6 动画系统深度分析

```
Grep pattern="gsap|framer-motion|anime\.js|lottie|react-spring"  →  JS 动画库
Grep pattern="requestAnimationFrame|setInterval.*animation"  →  原生动画循环
Grep pattern="will-change|transform|@keyframes"  →  CSS 动画
Grep pattern="ScrollTrigger|IntersectionObserver|scroll"  →  滚动触发
```

**提取项**:
- 动画库类型和版本
- 动画配置参数（持续时间、缓动函数、延迟）
- 编排模式（序列、交错、时间线、并行）
- 性能模式（will-change 使用、GPU 加速、帧率控制）
- 交互动画（hover、focus、scroll-triggered、入场/退场）

### 1.7 状态管理模式提取

```
Grep pattern="createStore|configureStore|defineStore|create\("  →  全局状态库
Grep pattern="useState|useReducer|ref\(|reactive\("  →  局部状态
Grep pattern="selector|useSelector|computed|get\("  →  状态派生
Grep pattern="loading|error|data|isLoading|isError"  →  异步状态模式
```

**提取项**:
- 状态库类型（Redux / Vuex / Pinia / Zustand / Jotai 等）
- 状态结构（扁平 vs 嵌套、模块化方式）
- 数据流方向（单向 vs 双向、状态提升方式）
- 异步状态处理（loading/error/data 模式、乐观更新）
- 状态持久化（localStorage、sessionStorage、URL 状态）

### 1.8 动态渲染模式提取

```
Grep pattern="\? .+ : |\|\||&&.*return"  →  条件渲染
Grep pattern="\.map\(|v-for|*ngFor"  →  列表渲染
Grep pattern="Suspense|lazy\(|defineAsyncComponent"  →  异步加载
Grep pattern="key=|:key="  →  key 使用模式
```

**提取项**:
- 条件渲染逻辑（三元运算、逻辑与、switch 语句）
- 列表渲染模式（key 使用、虚拟滚动、分页加载）
- 异步加载策略（Suspense、lazy loading、骨架屏）
- 数据绑定模式（单向/双向绑定、响应式系统）

### 1.9 3D 场景提取（Three.js / WebGL）

```
Grep pattern="THREE\.(Scene|Camera|Renderer|WebGLRenderer)"  →  场景基础架构
Grep pattern="THREE\.(BoxGeometry|SphereGeometry|PlaneGeometry|BufferGeometry|CylinderGeometry)"  →  几何体类型
Grep pattern="THREE\.(MeshStandardMaterial|MeshPhysicalMaterial|ShaderMaterial|PointsMaterial|LineBasicMaterial)"  →  材质类型
Grep pattern="THREE\.(PointLight|DirectionalLight|AmbientLight|SpotLight|HemisphereLight)"  →  灯光配置
Grep pattern="THREE\.(OrbitControls|TrackballControls|FlyControls)"  →  控制器
Grep pattern="new THREE\.(GLTFLoader|OBJLoader|FBXLoader|TextureLoader)"  →  资源加载器
Grep pattern="requestAnimationFrame|renderer\.render"  →  渲染循环
Grep pattern="uniform|varying|attribute|gl_Position|gl_FragColor"  →  自定义 Shader (GLSL)
Grep pattern="Points|BufferAttribute|InstancedMesh"  →  粒子/实例化渲染
Glob pattern="**/*.{glb,gltf,obj,fbx,bin}"  →  3D 模型文件
Glob pattern="**/*.{vert,frag,glsl}"  →  Shader 文件
```

**提取项**:
- 场景图结构（Scene → Group → Mesh 的层级关系）
- 相机配置（PerspectiveCamera / OrthographicCamera 参数）
- 渲染器参数（antialias、alpha、pixelRatio、toneMapping）
- 几何体参数（顶点数、段数、自定义 BufferAttribute）
- 材质配置（颜色、粗糙度、金属度、透明度、贴图）
- 灯光布局（位置、颜色、强度、阴影配置）
- 动画系统（关键帧动画、骨骼动画、变形动画）
- 粒子系统（粒子数量、运动逻辑、大小衰减）
- 资源清单（模型文件、贴图文件、Shader 文件列表）

**3D 场景代码结构模板**:
```javascript
// 场景初始化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer({ antialias, alpha });

// 几何体 + 材质 → Mesh
const geometry = new THREE.XxxGeometry(...params);
const material = new THREE.XxxMaterial({...config});
const mesh = new THREE.Mesh(geometry, material);

// 灯光
const light = new THREE.XxxLight(color, intensity);
light.position.set(x, y, z);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  // 更新逻辑
  renderer.render(scene, camera);
}
```

### 1.10 Canvas 2D 提取

```
Grep pattern="getContext\(['\"]2d['\"]"  →  Canvas 2D 上下文
Grep pattern="fillRect|strokeRect|clearRect|beginPath|arc\(|lineTo|moveTo"  →  绘图指令
Grep pattern="createLinearGradient|createRadialGradient|createPattern"  →  渐变/图案
Grep pattern="drawImage|getImageData|putImageData"  →  图像操作
Grep pattern="fillText|strokeText|measureText|font\s*="  →  文字渲染
Grep pattern="requestAnimationFrame|cancelAnimationFrame"  →  Canvas 动画循环
Grep pattern="addEventListener\(['\"]mousemove|addEventListener\(['\"]click"  →  Canvas 交互
Glob pattern="**/*.{canvas,png,jpg,svg}"  →  Canvas 引用的图片资源
```

**提取项**:
- Canvas 尺寸和 DPI 适配（canvas.width vs CSS width, devicePixelRatio）
- 绘图操作序列（路径绘制、形状、颜色填充）
- 渐变和图案配置
- 动画帧逻辑（帧率控制、清除策略）
- 交互事件绑定（鼠标追踪、点击检测）
- 图像处理操作（裁剪、滤镜、像素操作）

### 1.11 高级动画库提取

```
Grep pattern="lottie\.loadAnimation|bodymovin|Lottie"  →  Lottie 动画
Grep pattern="from\(|to\(|fromTo\(|timeline\("  →  GSAP 动画方法
Grep pattern="animate\(|useAnimate|useMotionValue|useTransform"  →  Framer Motion
Grep pattern="useSpring|useTransition|animated\."  →  React Spring
Grep pattern="anime\(|anime\.timeline"  →  Anime.js
Grep pattern="motion\.|variants|whileHover|whileTap|animate="  →  Framer Motion JSX
Grep pattern="transition:|spring:|tween:"  →  动画配置
Glob pattern="**/*.json"  →  Lottie JSON 动画文件
Glob pattern="**/*.{lottie,json}"  →  Lottie 资源
```

**提取项**:
- 动画库类型和版本
- Lottie: 动画 JSON 路径、播放控制（loop/autoplay/direction）、Segments
- GSAP: Timeline 编排、Stagger、ScrollTrigger 配置
- Framer Motion: variants 定义、layout 动画、手势动画（whileHover/whileTap）
- React Spring: spring 配置（mass/stiffness/damping）、过渡类型
- 通用: 缓动函数、持续时间、延迟、回调

### 1.12 拖拽交互提取

```
Grep pattern="useDrag|useDrop|onDragStart|onDragEnd|onDrop"  →  拖拽事件
Grep pattern="DragDropContext|Droppable|Draggable"  →  react-beautiful-dnd / DnD Kit
Grep pattern="Sortable|useSortable|sortableList"  →  SortableJS
Grep pattern="pointerdown|pointermove|pointerup|setPointerCapture"  →  Pointer Events 拖拽
Grep pattern="touchstart|touchmove|touchend"  →  触摸拖拽
Grep pattern="mousedown|mousemove|mouseup"  →  鼠标拖拽
Grep pattern="transform.*translate|left:|top:"  →  拖拽位移实现
```

**提取项**:
- 拖拽库类型（DnD Kit / SortableJS / react-beautiful-dnd / 原生实现）
- 拖拽模式（排序、跨容器移动、调整大小、自由拖动）
- 拖拽手柄（handle selector）
- 拖拽预览（drag preview / overlay）
- 放置区域逻辑（drop zone detection）
- 拖拽动画（排序过渡、回弹效果）
- 触摸支持（touch-action、手势冲突处理）

### 1.13 音频可视化提取

```
Grep pattern="AudioContext|OfflineAudioContext|createAnalyser"  →  Web Audio API
Grep pattern="createOscillator|createGain|createBiquadFilter"  →  音频节点
Grep pattern="getByteFrequencyData|getFloatTimeDomainData"  →  频谱/波形数据
Grep pattern="AnalyserNode|fftSize|frequencyBinCount"  →  分析器配置
Grep pattern="requestAnimationFrame.*draw|canvas.*audio"  →  音频驱动渲染
Grep pattern="createMediaElementSource|MediaStream"  →  音频源
Glob pattern="**/*.{mp3,wav,ogg,m4a}"  →  音频文件
```

**提取项**:
- AudioContext 配置（sampleRate、latencyHint）
- 分析器参数（fftSize、smoothingTimeConstant）
- 可视化类型（频谱柱状图、波形图、圆形频谱、粒子随音乐跳动）
- 频率数据处理（对数缩放、频段分组、峰值检测）
- 渲染方式（Canvas 2D / CSS 变量驱动 / Three.js 粒子）
- 音频源类型（Element / Buffer / Stream）

### 1.14 手势系统提取

```
Grep pattern="Hammer|useGesture|Gesture"  →  手势库
Grep pattern="pinch|rotate|swipe|pan|tap|longpress"  →  手势类型
Grep pattern="usePinch|useScroll|useWheel|useMove"  →  @use-gesture hooks
Grep pattern="touch-action|overscroll-behavior"  →  触摸行为 CSS
Grep pattern="IntersectionObserver|MutationObserver"  →  滚动/可见性观察
Grep pattern="scroll-timeline|view-timeline|animation-timeline"  →  滚动驱动动画
```

**提取项**:
- 手势库类型（Hammer.js / @use-gesture / 原生 Pointer Events）
- 手势类型（捏合、旋转、滑动、拖拽、长按、双击）
- 手势配置（阈值、方向锁定、速度检测）
- 滚动驱动动画（scroll-timeline、IntersectionObserver）
- 触摸优化（touch-action、被动事件监听、防抖）

### 1.15 Electron 桌面端提取

**仅当 Phase 1.1 识别到 Electron 时执行此步骤。**

```
Grep pattern="BrowserWindow|BrowserView"  →  窗口创建配置
Grep pattern="ipcMain\.on|ipcMain\.handle|ipcRenderer\.send|ipcRenderer\.invoke"  →  IPC 通信
Grep pattern="preload|contextBridge|exposeInMainWorld"  →  预加载脚本
Grep pattern="globalShortcut|accelerator"  →  全局快捷键
Grep pattern="Tray|Menu|MenuItem"  →  系统托盘和菜单
Grep pattern="dialog\.show|dialog\.showMessageBox"  →  系统对话框
Grep pattern="shell\.openExternal|shell\.showItemInFolder"  →  系统 shell 操作
Grep pattern="session\.defaultSession|cookies\.set|cookies\.get"  →  会话/Cookie 管理
Grep pattern="webContents\.send|win\.webContents"  →  窗口间通信
Grep pattern="-webkit-app-region:\s*drag|app-region"  →  可拖拽区域（标题栏）
Grep pattern="transparent.*true|frame.*false|vibrancy|trafficLightPosition"  →  无边框/透明窗口
Glob pattern="**/main.js"  →  Electron 主进程入口
Glob pattern="**/preload*.js"  →  预加载脚本
Glob pattern="**/*.nsh"  →  NSIS 安装脚本
```

**提取项**:

**窗口配置**:
- BrowserWindow 参数（width/height/transparent/frame/vibrancy/alwaysOnTop）
- 窗口状态记忆（位置/大小持久化）
- 窗口比例锁定（aspectRatio）
- 最小窗口尺寸限制

**自定义标题栏**:
- 标题栏 HTML 结构和样式
- 最小化/最大化/关闭按钮实现
- `-webkit-app-region: drag` 拖拽区域
- 窗口控制按钮 hover/active 效果
- 双击标题栏最大化/还原

**多窗口系统**:
- 窗口类型清单（主窗口、歌词窗口、壁纸窗口、设置窗口）
- 窗口间 IPC 通信协议
- 窗口生命周期管理（创建/销毁/显示/隐藏）

**系统集成**:
- 全局快捷键注册（播放/暂停、上一首/下一首）
- 系统托盘（图标、右键菜单、气泡通知）
- 开机自启动
- 单实例锁（防止多开）

**安装包配置**:
- electron-builder / electron-forge 配置
- NSIS 安装脚本（自定义界面、安装流程）
- 应用图标（.ico / .icns）
- 代码签名配置

**Electron 代码结构模板**:
```javascript
// main.js - 主进程
const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 960, height: 540,
    frame: false,           // 无边框
    transparent: true,      // 透明
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('public/index.html');
}

// preload.js - 预加载脚本
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});

// renderer 中调用
window.electronAPI.minimize();
```

### 1.16 写入 reference.md

将以上所有提取结果写入 `.layout-clone/reference.md`，格式：

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
## Data Models (v7.0.0 新增)
## Site Map (v7.1.0)
```

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

## v7.2.0 执行增强

### Extractors 提取器规范

具体提取逻辑应优先复用稳定的 Extractor，而不是每次临时编写不一致的脚本。可用提取器包括：

| Extractor | 用途 | 输出 |
|---|---|---|
| `extractSemanticDOM` | 提取语义 DOM 和组件层级 | `semantic_tree` |
| `extractDesignTokens` | 提取 computed style 和视觉变量 | `tokens.json` |
| `extractInteractiveStates` | 记录 hover、focus、click、scroll 状态 | `interactions` |
| `interceptNetworkRequests` | 捕获允许分析的 JSON 请求并推断 Schema | `data_models` |
| `extractSiteMap` | 提取内部页面和导航关系 | `site_map` |
| `extractRuntimeAssets` | 收集图片、字体、动画、模型和音频资源 | `assets` |

Extractor 必须遵守以下规则：

- 输入、输出和失败状态必须明确
- 不抓取不必要的敏感数据、Cookie、Token 或个人信息
- 不能将样本数据直接当作完整 API Schema
- 提取失败时返回部分结果和 `limitations`，不能伪造完整结果
- 复杂脚本应放在 Skill 的 `extractors/` 或 `references/` 目录中，由流程文档调用

每个 Extractor 的标准输出：

```yaml
extractor_result:
  name: "extractSemanticDOM"
  status: "success | partial | failed | unavailable"
  data: {}
  evidence: []
  limitations: []
```

### Advanced 模式共享上下文协议

仅当 Phase 3 选择 `Advanced` 模式时，必须创建 `.layout-clone/shared-context.json`。Simple 模式不创建，Standard 模式按需创建。

```json
{
  "version": "7.2.0",
  "mode": "advanced",
  "strategy": "full-clone",
  "targetProject": {
    "framework": "react",
    "language": "typescript",
    "cssSolution": "existing-project-solution",
    "stateManagement": "existing-solution",
    "animationLibrary": "existing-solution"
  },
  "reference": {
    "analysisPath": ".layout-clone/reference.md",
    "tokensPath": ".layout-clone/tokens.json"
  },
  "planPath": ".layout-clone/implementation-plan.md",
  "components": {},
  "protectedAreas": [],
  "constraints": {
    "noNewDependencies": true,
    "preserveBusinessLogic": true,
    "assignedFilesOnly": true
  }
}
```

子 Agent 必须只修改分配给自己的文件，并返回文件清单、接口要求、依赖和未完成项。主 Agent 负责合并、冲突处理、构建检查和最终验证。

### Diff & Patch 修改安全机制

生成或修改已有项目时，必须优先采用局部修改：

1. 先在 `implementation-plan.md` 中列出文件和修改范围
2. 优先创建独立组件或样式模块
3. 对大型业务文件使用局部 Patch，不得无理由全量覆写
4. 修改前识别 API、认证、路由、全局状态和业务数据边界
5. 修改后检查 diff，确认没有越过 `protected_areas`
6. 输出修改摘要和未解决冲突

如果实现必须修改受保护文件，必须暂停生成并请求用户确认。没有确认时，只能提供补丁建议或在独立文件中实现替代方案。

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

以下旧版分工内容仅保留为兼容说明；实际委派必须遵循 `3.5 多 Agent 协作规则` 和 v7.2.0 的 `shared-context.json` 协议。

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
  "version": "7.0.0",
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
| 克隆完整界面+交互+动画+3D+音频+Electron | ✓ (v7.0) | - |
| 只克隆静态布局 | ✓ (v7.0 策略 A/B/C) | - |
| 只克隆 3D 场景 | ✓ (v7.0 Phase 1.9) | - |
| 只克隆 Canvas 2D 效果 | ✓ (v7.0 Phase 1.10) | - |
| 只克隆拖拽交互 | ✓ (v7.0 Phase 1.12) | - |
| 只克隆音频可视化 | ✓ (v7.0 Phase 1.13) | - |
| 只克隆 Electron 桌面端 | ✓ (v7.0 Phase 1.15) | - |
| 从线上站点提取设计灵感 | ✓ (v7.0 Dynamic Extraction) | - |
| 逆向工程 API 数据模型 | ✓ (v7.0 Step E) | - |
| 导出 W3C 设计令牌 | ✓ (v7.0 Step C.2) | - |
| 多页面站点克隆 | ✓ (v7.1 Step A.5) | - |
| 多代理协作生成 | ✓ (v7.0 Phase 3) | - |
| 对已有页面做精细视觉调整 | - | → `impeccable` |
| 从零设计一个 premium 风格页面 | - | → `looks-expensive` |
| 对已生成的布局做微调和 polish | 先生成，然后 | → `impeccable` 做精调 |
| 需要 anti-slop 检查 | Phase 4 自带 | 可追加 `looks-expensive` |

**协作流程**: 本 skill 生成布局+交互 → 用户确认结构和功能正确 → 按需加载其他 skill 做精调。
