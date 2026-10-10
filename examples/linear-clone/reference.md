# Reference Analysis: Linear.app

> 提取方式: Dynamic Extraction (v1.1.0)
> 提取时间: 2026-06-29T16:55:00Z
> 目标 URL: https://linear.app/

## Tech Stack

| 技术 | 版本/详情 |
|------|----------|
| 框架 | Next.js (vinext/React Server Components) |
| CSS-in-JS | styled-components v6.1.24（SSR 内联注入） |
| CSS 方案 | 双轨并行：CSS Modules（Vite 哈希）+ styled-components |
| 动画库 | Framer Motion（motion/react，按需加载） |
| UI 库 | Radix UI（导航菜单等） |
| 字体 | Inter Variable v4.1 (woff2)、Berkeley Mono v3.2、Tiempos Headline |
| 主题系统 | `data-theme` 属性（dark/light/glass），localStorage 持久化 |
| CDN | Cloudflare (static.linear.app, webassets.linear.app) |
| 构建 | Vite RSC (vite-rsc/client-reference) |
| Canvas/WebGL | 首页未检测到 |
| Audio/Video | 首页未检测到 |

## Layout Structure

### 页面骨架

```
body[data-theme="dark"]
├── header.TZTsQG_header (fixed, height: 72px, blur: 20px)
│   └── nav[aria-label="Main"] (horizontal)
│       ├── a.logo (Linear logo, 22px height)
│       ├── ul.TZTsQG_list (horizontal nav items)
│       └── a.skip-nav (href="#skip-nav")
├── main._5l06ia_container
│   ├── div[data-header] (header sentinel)
│   └── div.MwJdiW_root (page content)
│       ├── div.benefit-section (×6, version 1.0~6.0)
│       │   ├── div.description (h2 + p + action link)
│       │   └── div.illustration (SVG, responsive)
│       ├── div.carousel (NAY0wa_root)
│       ├── div.benefits-grid (GJ9TEa_root)
│       ├── div.customer-quotes
│       └── div.footer
```

### Grid 系统

- 12 栏 Grid（`--grid-columns: 12`）
- 最大宽度：prose 1024px，homepage 1344px + outer-padding
- 外边距：46px（desktop）→ 28px（1024px）→ 16px（640px）
- 内边距 inset：32px（desktop）→ 8px（1024px）

### 响应式断点

| 断点 | max-width | 用途 |
|------|-----------|------|
| Desktop | > 1280px | 全功能布局 |
| Laptop | 1024-1280px | 标题缩放、时间线布局 |
| Tablet | 768-1024px | 进一步简化、carousel 卡片 |
| Mobile | ≤ 640px | 全移动布局、图片 fallback |

### 布局模式

- **Header**: 固定顶部，backdrop-filter: saturate(1.8) blur(20px)
- **Content**: `grid-template-columns: 1fr 3fr`（desktop）→ `1fr`（mobile）
- **Panel**: `border: 1px solid var(--color-border-primary)`, `border-radius: 5px`, 多层 box-shadow
- **Carousel**: `--Carousel-gap: 8px`, card `--mobile-width: 230px`

## Design System

### 颜色系统（Dark Theme）

```yaml
background:
  primary: "#08090a"       # 主背景
  secondary: "#1c1c1f"     # 次级背景
  tertiary: "#232326"      # 三级背景
  quaternary: "#28282c"    # 四级背景
  quinary: "#282828"       # 五级背景
  marketing: "#010102"     # 营销页背景
  translucent: "#ffffff0d"  # 半透明背景
  panel: "#0f1011"         # 面板背景
  level-0: "#08090a"       # 层级 0
  level-1: "#0f1011"       # 层级 1
  level-2: "#141516"       # 层级 2
  level-3: "#191a1b"       # 层级 3
  tint: "#141516"          # 色调背景

text:
  primary: "#f7f8f8"       # 主文本（近白）
  secondary: "#d0d6e0"     # 次级文本
  tertiary: "#8a8f98"      # 三级文本
  quaternary: "#62666d"    # 四级文本

border:
  primary: "#23252a"       # 主边框
  secondary: "#34343a"     # 次级边框
  tertiary: "#3e3e44"      # 三级边框
  translucent: "#ffffff0d"  # 半透明边框
  translucent-strong: "#ffffff14"

accent:
  brand-bg: "#5e6ad2"      # 品牌色（Linear 紫）
  brand-text: "#fff"
  accent: "#7170ff"        # 强调色
  accent-hover: "#828fff"
  accent-tint: "#18182f"
  link-primary: "#828fff"
  link-hover: "#fff"

status:
  red: "#eb5757"
  green: "#27a644"
  orange: "#fc7840"
  yellow: "#f0bf00"
  blue: "#4ea7fc"          # Dynamic Range 时升级为 #5eb0ff
  teal: "#00b8cc"
  indigo: "#5e6ad2"

button:
  invert-bg: "#e5e5e6"
  invert-bg-hover: "#fff"

selection:
  text: "#fff"
  bg: "color-mix(in lch, #5e6ad2, black 10%)"

overlay:
  primary: "#000000d9"
  dim-rgb: "255, 255, 255"
```

### Light Theme 关键差异

```yaml
background:
  primary: "#fff"
  secondary: "#f9f8f9"
  tertiary: "#f4f2f4"
text:
  primary: "#282a30"
  secondary: "#3c4149"
  tertiary: "#6f6e77"
  quaternary: "#86848d"
accent:
  brand-bg: "#7070ff"
  accent: "#7070ff"
```

### Glass Theme

```yaml
background:
  primary: "#000212"
  secondary: "#ffffff08"
  tertiary: "#ffffff12"
  quaternary: "#ffffff26"
```

### 字体系统

```yaml
font-family:
  regular: '"Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif'
  monospace: '"Berkeley Mono", ui-monospace, "SF Mono", "Menlo", monospace'
  serif-display: '"Tiempos Headline", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
  emoji: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"'

font-weight:
  light: 300
  normal: 400
  medium: 510
  semibold: 590
  bold: 680

font-feature-settings: '"cv01", "ss03"'
font-variation-settings: '"opsz" auto'
```

### 排版比例尺

```yaml
title-scale:
  title-1: { size: 1.0625rem, line-height: 1.4, letter-spacing: -0.012em }
  title-2: { size: 1.25rem,   line-height: 1.33, letter-spacing: -0.012em }
  title-3: { size: 1.5rem,    line-height: 1.33, letter-spacing: -0.012em }
  title-4: { size: 2rem,      line-height: 1.125, letter-spacing: -0.022em }
  title-5: { size: 2.5rem,    line-height: 1.1, letter-spacing: -0.022em }
  title-6: { size: 3rem,      line-height: 1, letter-spacing: -0.022em }
  title-7: { size: 3.5rem,    line-height: 1.1, letter-spacing: -0.022em }
  title-8: { size: 4rem,      line-height: 1.06, letter-spacing: -0.022em }
  title-9: { size: 4.5rem,    line-height: 1, letter-spacing: -0.022em }

text-scale:
  text-tiny:  { size: 0.625rem,  line-height: 1.5, letter-spacing: -0.015em }
  text-micro: { size: 0.75rem,   line-height: 1.4, letter-spacing: 0 }
  text-mini:  { size: 0.8125rem, line-height: 1.5, letter-spacing: -0.01em }
  text-small: { size: 0.875rem,  line-height: calc(21/14), letter-spacing: -0.013em }
  text-regular: { size: 0.9375rem, line-height: 1.6, letter-spacing: -0.011em }
  text-large: { size: 1.0625rem, line-height: 1.6, letter-spacing: 0 }
```

### 圆角系统

```yaml
radius:
  4: 4px
  6: 6px
  8: 8px
  12: 12px
  16: 16px
  24: 24px
  32: 32px
  rounded: 9999px
  circle: 50%
```

### 阴影系统

```yaml
dark-theme:
  none: "0px 0px 0px transparent"
  tiny: "var(--shadow-none)"
  low: "0px 2px 4px #0000001a"
  medium: "0px 4px 24px #0003"
  high: "0px 7px 32px #00000059"
  stack-low: "0px 8px 2px 0px #0000, 0px 5px 2px 0px #00000003, 0px 3px 2px 0px #0000000a, 0px 1px 1px 0px #00000012, 0px 0px 1px 0px #00000014"

light-theme:
  tiny: "0px 1px 1px 0px #00000017"
  low: "0px 1px 4px -1px #00000017"
  medium: "0px 3px 12px #00000017"
  high: "0px 7px 24px #0000000f"
```

### Easing 函数

```yaml
easing:
  in-quad: cubic-bezier(.55, .085, .68, .53)
  in-cubic: cubic-bezier(.55, .055, .675, .19)
  in-quart: cubic-bezier(.895, .03, .685, .22)
  in-quint: cubic-bezier(.755, .05, .855, .06)
  in-expo: cubic-bezier(.95, .05, .795, .035)
  in-circ: cubic-bezier(.6, .04, .98, .335)
  out-quad: cubic-bezier(.25, .46, .45, .94)
  out-cubic: cubic-bezier(.215, .61, .355, 1)
  out-quart: cubic-bezier(.165, .84, .44, 1)
  out-quint: cubic-bezier(.23, 1, .32, 1)
  out-expo: cubic-bezier(.19, 1, .22, 1)
  out-circ: cubic-bezier(.075, .82, .165, 1)
  in-out-quad: cubic-bezier(.455, .03, .515, .955)
  in-out-cubic: cubic-bezier(.645, .045, .355, 1)
  in-out-quart: cubic-bezier(.77, 0, .175, 1)
  in-out-quint: cubic-bezier(.86, 0, .07, 1)
  in-out-expo: cubic-bezier(1, 0, 0, 1)
  in-out-circ: cubic-bezier(.785, .135, .15, .86)
```

### 速度变量

```yaml
speed:
  highlightFadeIn: 0s
  highlightFadeOut: 0.15s
  quickTransition: 0.1s
  regularTransition: 0.25s
```

### Z-Index 分层

```yaml
layer:
  max: 10000
  debug: 5100
  skip-nav: 5000
  context-menu: 1200
  tooltip: 1100
  toasts: 800
  dialog: 700
  dialog-overlay: 699
  command-menu: 650
  popover: 600
  overlay: 500
  header: 100
  scrollbar: 75
  footer: 50
  3: 3
  2: 2
  1: 1
```

### 间距和尺寸

```yaml
spacing:
  page-padding-inline: 24px
  page-padding-block: 64px
  page-max-width: 1024px
  prose-max-width: 624px
  homepage-outer-padding: 46px
  homepage-padding-inset: 32px
  grid-columns: 12

header:
  height: 72px (desktop) / 64px (mobile ≤640px)
  blur: 20px

border:
  hairline: 1px (0.5px on retina)
```

## Component Patterns

### Button

```
a.I_mUeq_root (link wrapper)
  div.[component]_action.ImRUSq_root.ImRUSq_align-center
    span (icon/version number)
    span (label text)
    span (arrow "→")
```

- CSS: `Button.dcAi4KbO.css`
- 高度变量: `--button-height`

### Panel/Container (with grain texture)

```
div.MwJdiW_container.[name]_container
  div.MwJdiW_panel.[name]_panel
    div.SPbJba_grain[.SPbJba_grainSubtle]
      style="top:1px" (optional)
    <!-- Content -->
```

- `pointer-events: none` on grain overlay（避免 GPU 重绘负担）
- CSS: `Grain.D_EBlr94.css`

### Carousel

```
div.NAY0wa_root.NAY0wa_variant-inset.NAY0wa_align-start
  style="--min-padding:0px; --Carousel-gap:8px"
  div.NAY0wa_content
    div.NAY0wa_inner
      div.GJ9TEa_carouselCard.NAY0wa_item
        style="--mobile-width:230px"
        div.illustration (SVG)
        div.text (category + description)
```

### Navigation (Radix UI)

```
nav.TZTsQG_menuRoot[data-orientation="horizontal"]
  div.TZTsQG_innerWrapper
    ul.TZTsQG_list
      li.TZTsQG_logoItem
      li.TZTsQG_item (multiple)
```

- CSS: `Header.DrX8EJz9.css`

### Dialog/Modal

- CSS: `Dialog.CwVvSJva.css`
- Module: `Dialog-C2R0Lo-Z.js`, `useModalLink-D4XLYWZv.js`

### Toast/Notification

```
section[aria-label="Notifications alt+T"]
  [aria-live="polite"]
  [aria-atomic="false"]
```

- CSS: `Toast.pcGZUK31.css`

### Code Diff

```
div.codeSection
  div.codeColumn
    pre > code
      span.line.old (removed lines)
        span.keyword / .text / .entity / .constant
      span.line.new.diff-new (added lines)
        span.charAdded (green)
        span.charRemoved (red)
```

- CSS: `code-diff.NhuKB87D.css`

### Tooltip

- CSS: `Tooltip.mgHd0F-S.css`
- Module: `Tooltip-BkpnKu6f.js`, `TooltipPopup--ECJWMgL.js`

### Marquee/Scrolling

- CSS: `Marquee.Dz6fDVMv.css`

### Benefits Grid

```
div.GJ9TEa_benefits._9PBFba_root
  style="gap:0; --grid-areas-default: ..."
  div._9PBFba_a (grid area "a")
  div._9PBFba_b (grid area "b")
  div._9PBFba_c (grid area "c")
```

## Animations

### CSS @keyframes — 网格点阵系统

5x5 网格点阵，3 套独立动画方案，仅操纵 `opacity`（0.3 = 暗，1.0 = 亮）：

| 方案 | 命名 | 总时长 | 步数 | 缓动 | 效果 |
|------|------|--------|------|------|------|
| upDown | `grid-dot-{r}-{c}-upDown` | 2800ms | 14步 | steps(1,end) | 对角线波纹扫过 |
| pong | `grid-dot-{r}-{c}-pong` | 1600ms | 8步 | steps(1,end) | 乒乓弹跳 |
| agent | `grid-dot-{r}-{c}-agent` | 3200ms | 16步 | steps(1,end) | 中心向外扩展 |

- 每套方案 25 个 keyframe 定义（5×5 网格）
- 每套方案在页面不同位置重复 2 组（共 6 组，361 个 @keyframes 匹配）
- 效果：模拟数字化/矩阵风格的像素级离散跳变

### CSS 动画 — 其他

```
@keyframes _5pslva_fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
```
- 持续时间: 0.48s, 缓动: var(--ease-out-quint)

### Framer Motion 模块

| 模块 | 用途 |
|------|------|
| motion-DdoTRF5Y.js | 核心 motion 库 |
| AnimatePresence-DhOdj_2P.js | 进入/退出动画 |
| MotionConfigContext-DYz_gpgZ.js | 动画配置上下文 |
| use-transform-Cx8oRVMn.js | useTransform hook |
| use-motion-value-Du2_oRqT.js | useMotionValue hook |
| use-spring-CvkIM9-s.js | useSpring hook |
| use-reduced-motion-DbT9BhPM.js | 无障碍动画降级 |
| use-in-view-Dkqa7kFf.js | 滚动可见性检测 |
| LayoutGroup-B8Tij8Vp.js | 布局动画 |
| animate-D7gE1PNb.js | 命令式 animate() |

### CSS Transition 模式（StyleX 生成）

```yaml
transitions:
  - property: border, background-color, color, opacity
    duration: 0.25s
  - property: fill, stroke
    duration: 0.3s
  - property: fill
    duration: 0.35s
  - property: opacity
    duration: 0.15s
  - property: stroke-dasharray
    duration: 0.3s
  - property: transform
    duration: 0.1s
  - property: all
    duration: 0.25s

hover-effects:
  - selector: ".guide:hover:before"
    property: opacity
    from: 0 → 1
  - selector: "a:hover"
    property: text-decoration-color
    from: var(--color-text-quaternary) → var(--color-text-primary)

active-effects:
  - selector: "[data-active=true] *"
    property: fill
    to: var(--sx-ys2i3t)

disabled-effects:
  - selector: ":disabled, [data-disabled=true]"
    opacity: 0.6
    cursor: default
```

### Prefers-Reduced-Motion 支持

```css
@media (prefers-reduced-motion: reduce) {
  .animation-name { animation-name: none }
  ::view-transition-group(*) { animation: none !important }
}
```

## Interactions

### 主题切换

- 检测 `prefers-color-scheme: dark` 媒体查询
- 从 `localStorage` 读取保存的偏好
- 支持 `dark`/`light`/`glass` 三种主题
- 通过 `data-theme` 属性 + CSS class 切换

### 导航交互

- Radix UI Menu 组件（`data-orientation="horizontal"`）
- 水平导航，logo + 导航项列表
- 跳过导航链接（`a[href="#skip-nav"]`）

### 链接样式过渡

```css
a:not([class]) {
  text-decoration: underline;
  text-decoration-thickness: var(--underline-thickness);
  text-underline-offset: var(--underline-offset);
  text-decoration-color: var(--color-text-quaternary);
  transition: var(--speed-regularTransition);
  transition-property: color, text-decoration-color, background;
}
a:not([class]):hover {
  text-decoration-color: var(--color-text-primary);
}
```

### 焦点环

```css
:focus-visible {
  outline-style: solid;
  outline-color: var(--focus-ring-color);  /* #5e6ad2 */
  outline-width: var(--focus-ring-width);  /* 2px */
  outline-offset: var(--focus-ring-offset); /* 2px */
}
```

### 自定义滚动条

```css
[data-custom-scrollbar]::-webkit-scrollbar {
  width: 12px;
  background: transparent;
}
[data-custom-scrollbar]::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);  /* #ffffff1a */
  border-radius: var(--radius-rounded);
  border: 3px solid transparent;
}
```

## Semantic Tree

```json
{
  "tag": "body",
  "attrs": { "data-theme": "dark" },
  "children": [
    {
      "tag": "header",
      "class": "TZTsQG_header",
      "children": [
        {
          "tag": "nav",
          "attrs": { "aria-label": "Main", "data-orientation": "horizontal" },
          "children": [
            { "tag": "a", "class": "logo", "text": "Linear Logo" },
            {
              "tag": "ul",
              "class": "TZTsQG_list",
              "children": [
                { "tag": "li", "class": "TZTsQG_item", "text": "Features" },
                { "tag": "li", "class": "TZTsQG_item", "text": "Solutions" },
                { "tag": "li", "class": "TZTsQG_item", "text": "Pricing" },
                { "tag": "li", "class": "TZTsQG_item", "text": "Changelog" },
                { "tag": "li", "class": "TZTsQG_item", "text": "Docs" }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "main",
      "class": "_5l06ia_container MwJdiW_root",
      "children": [
        {
          "tag": "section",
          "class": "hero",
          "children": [
            { "tag": "h1", "text": "Linear is a purpose-built tool for planning and building products" },
            { "tag": "p", "text": "Streamline issues, projects, and product roadmaps." }
          ]
        },
        {
          "tag": "section",
          "class": "benefit-section",
          "attrs": { "data-version": "1.0" },
          "children": [
            { "tag": "h2", "text": "Intake" },
            { "tag": "p", "text": "Turn conversations into actionable issues." },
            { "tag": "a", "class": "action", "text": "1.0 Intake →" }
          ]
        },
        {
          "tag": "section",
          "class": "benefit-section",
          "attrs": { "data-version": "2.0" },
          "children": [
            { "tag": "h2", "text": "Plan" },
            { "tag": "p", "text": "Product direction, roadmaps, PRDs." },
            { "tag": "a", "class": "action", "text": "2.0 Plan →" }
          ]
        },
        {
          "tag": "section",
          "class": "benefit-section",
          "attrs": { "data-version": "3.0" },
          "children": [
            { "tag": "h2", "text": "Build" },
            { "tag": "p", "text": "AI agents across teams." },
            { "tag": "a", "class": "action", "text": "3.0 Build →" }
          ]
        },
        {
          "tag": "section",
          "class": "carousel",
          "children": [
            { "tag": "div", "class": "carouselCard", "text": "Product screenshot 1" },
            { "tag": "div", "class": "carouselCard", "text": "Product screenshot 2" }
          ]
        },
        {
          "tag": "section",
          "class": "benefits-grid",
          "children": [
            { "tag": "div", "class": "grid-area-a" },
            { "tag": "div", "class": "grid-area-b" },
            { "tag": "div", "class": "grid-area-c" }
          ]
        }
      ]
    }
  ]
}
```

## Responsive Behavior

### 标题层级降级

| 视口 | Display (title-9) | Hero (title-8) | Section (title-6) | Sub (title-4) |
|------|-------------------|----------------|---------------------|---------------|
| Desktop (>1280px) | title-9 (4.5rem) | title-8 (4rem) | title-6 (3rem) | title-4 (2rem) |
| Tablet (≤1280px) | title-5 (2.5rem) | title-7 (3.5rem) | title-5 (2.5rem) | title-2 (1.25rem) |
| Small Tablet (≤1024px) | - | title-7 (3.5rem) | title-5 (2.5rem) | title-2 (1.25rem) |
| Mobile (≤640px) | - | title-5 (2.5rem) | title-2 (1.25rem) | title-1 (1.0625rem) |

### 元素可见性控制

```css
@media (max-width: 640px)  { .hide-mobile { display: none !important } }
@media (min-width: 641px)  { .show-mobile { display: none !important } }
@media (max-width: 768px)  { .hide-tablet { display: none !important } }
@media (min-width: 769px)  { .show-tablet { display: none !important } }
@media (max-width: 1024px) { .hide-laptop { display: none !important } }
@media (min-width: 1025px) { .show-laptop { display: none !important } }
@media (max-width: 1280px) { .hide-desktop { display: none !important } }
@media (min-width: 1281px) { .show-desktop { display: none !important } }
```

### Grid 列数响应

```css
:root { --grid-columns: 12 }
@media (max-width: 768px) { :root { --grid-columns: 8 } }
@media (max-width: 640px) { :root { --grid-columns: 4 } }
```

### 溢出控制

```css
@media (max-width: 1024px) { .layout { overflow: hidden } }
```

## Advanced Animations

### CSS @keyframes — 网格点阵（完整模式）

每个网格点的 keyframe 结构：

```css
@keyframes grid-dot-0-0-upDown {
  0%    { opacity: 0.3 }
  7.14% { opacity: 1 }
  14.28% { opacity: 0.3 }
  /* ... 14 步 ... */
  100%  { opacity: 0.3 }
}
```

- 缓动：`steps(1, end)` — 无过渡，瞬间跳变
- 属性：仅 `opacity`（0.3 = 暗，1.0 = 亮）
- 重复：`animation-iteration-count: infinite`
- 用途：产品展示区域的视觉装饰

### Grain/Noise 纹理叠加

```css
.grain {
  pointer-events: none;
  z-index: var(--layer-3);
  animation: fadeIn 0.48s var(--ease-out-quint) forwards;
}
```

### Scroll-Driven Animations

- 首页 SSR 输出中未检测到（客户端 JS 按需加载）
- 使用 `IntersectionObserver` + Framer Motion `useInView`

## Glossary

| 术语 | 含义 |
|------|------|
| AOM | Accessibility Object Model（无障碍树） |
| Computed Style | 浏览器实际计算后的样式值 |
| Design Token | 设计系统中的原子级样式变量 |
| Dynamic Extraction | 从线上 URL 通过无头浏览器提取设计信息 |
| Steps | CSS animation-timing-function 的阶梯缓动 |
