# 线上 URL 动态嗅探

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：参考输入为线上 URL 或本地开发服务器时阅读。Playwright + 视觉模型 + 脚本注入 + 网络拦截的完整提取流程（Step A～E）。

## 目录

- Dynamic Extraction Phase: 线上 URL 动态嗅探工作流
  - 认证会话与安全边界
  - Step A: 视觉骨架分析
  - Step A.5: 站点地图提取 (Site Map Extraction)
  - Extractor 执行优先级
  - Step B: 降噪与语义结构提取
  - Step C: 标准设计资产导出 (W3C Design Tokens)
  - Step C.0: Design Tokens 输出约束
    - Step C.2: W3C Design Tokens 导出
  - Step D: 交互状态触探
  - Step E: 网络拦截与 API 数据模型提取 (Network Interception)
  - Dynamic Extraction Phase: 写入 reference.md

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

`scripts/` 目录中的脚本是标准执行实现。正文中的内联 JavaScript 仅作为算法说明、兼容降级方案和结果格式参考；当对应 Extractor 可用时，不得重复编写或优先执行旧版内联脚本。

Extractor 的统一结果必须包含 `extractor`、`status`、`data` 和 `limitations`。提取结果写入 `reference.md` 或指定输出文件时，只使用 `data` 中的标准字段。

### Step B: 降噪与语义结构提取

优先调用 `scripts/semantic-dom.js`。它支持语义节点、Shadow DOM、同源 iframe 和跨域限制记录。

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

优先调用 `scripts/design-tokens.js`。内联脚本只用于没有 Extractor 执行能力时的降级方案。最终写入 `.layout-clone/tokens.json` 的内容使用 Extractor 返回的 `data.tokens`，原始采样值保存在 `data.rawValues`。

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

1. **静态线索层**：调用 `scripts/interactive-states.js`，识别可交互元素、可聚焦元素、ARIA 状态、transition 和可能的事件入口；该脚本不会主动触发动作。
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

优先调用 `scripts/network-schema.js`。宿主网络监听器必须把允许分析的 JSON 响应样本写入 `window.__uiLayoutCloneResponses`；Extractor 只做脱敏和结构推断，不负责获取认证凭据。

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

