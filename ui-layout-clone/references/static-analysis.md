# 本地源码静态分析（Phase 1）

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：参考输入为本地源码项目或文件时阅读。AST/Grep 静态分析流程。

## 目录

- Phase 1: 参考项目分析（本地源码模式）
  - 1.1 技术栈识别
  - 1.2 布局结构提取
  - 1.3 设计系统提取
  - 1.4 组件模式提取
  - 1.5 JS 交互行为提取
  - 1.6 动画系统深度分析
  - 1.7 状态管理模式提取
  - 1.8 动态渲染模式提取
  - 1.9 3D 场景提取（Three.js / WebGL）
  - 1.10 Canvas 2D 提取
  - 1.11 高级动画库提取
  - 1.12 拖拽交互提取
  - 1.13 音频可视化提取
  - 1.14 手势系统提取
  - 1.15 Electron 桌面端提取
  - 1.16 写入 reference.md

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

